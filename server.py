"""Local-only AFTERHOURS server. Secrets are never served as static files."""
import base64
import json
import os
from pathlib import Path
import threading
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit, quote
import websocket

ROOT = Path(__file__).resolve().parent
LOCK = threading.Lock()
PUBLIC = {'/', '/index.html', '/style.css', '/app.js', '/rhythm.js', '/ai-music.js', '/vendor/three.js', '/vendor/lame.min.js', '/composer.js', '/composer-core.js', '/composer-audio.js', '/composer.css'}
PROMPTS = {
    'techno': 'Hypnotic underground club techno, emotionally rich dark minor-key harmony, enveloping layered synthesizers, deep warm bass, atmospheric depth, a compelling evolving melodic motif, cohesive professionally balanced instrumental arrangement',
    'acid': 'Acid techno, underground warehouse techno, restrained resonant 303 acid sequence, drum-led repetitive club groove',
    'groove': 'Hardgroove techno, driving warehouse techno, rolling tribal tom percussion, syncopated percussive loops',
}
TEXTURES = {
    'techno': 'Interlocking bass and synth phrasing, spacious evolving pads, expressive filtered lead, subtle harmonic tension and release, restrained high frequencies, musical development rather than a bare percussive loop',
    'acid': 'Short monophonic 303 bass sequence, controlled acid resonance and filter movement, tight dry percussion, dominant kick',
    'groove': 'Layered toms and shakers around a dominant straight kick, short muted bass pattern, dry drums, minimal pitched material',
}

def music_request(genre, bpm, density, brightness, hits=None, loop_bars=1):
    positions = ', '.join(f'{x*loop_bars*4:.2f}' for x in (hits or []))
    rhythm = f'{bpm} BPM, {loop_bars}-bar user rhythm with accents at quarter-note positions {positions}. Build bass and melodic phrasing around this syncopated groove. The user supplies the kick rhythm; emphasize harmonic and tonal accompaniment with restrained percussion.'
    return {
        'clientContent': {'weightedPrompts': [
            {'text': PROMPTS[genre], 'weight': 3.0},
            {'text': rhythm, 'weight': 2.0},
            {'text': TEXTURES[genre], 'weight': 1.0},
        ]},
        'musicGenerationConfig': {
            'bpm': bpm, 'density': density, 'brightness': brightness,
            'guidance': 5.0, 'temperature': 1.0, 'musicGenerationMode': 'QUALITY', 'muteDrums': True,
        },
    }


def api_key():
    value = os.environ.get('GEMINI_API_KEY', '').strip()
    if value:
        return value
    path = ROOT / '.env'
    if path.is_file():
        for line in path.read_text().splitlines():
            if line.startswith('GEMINI_API_KEY='):
                return line.partition('=')[2].strip().strip('\"\'')
    return ''

class ProviderError(Exception):
    pass


def receive_json(ws):
    while True:
        opcode, payload = ws.recv_data(control_frame=True)
        if opcode == websocket.ABNF.OPCODE_CLOSE:
            reason = payload[2:].decode(errors='replace').lower() if len(payload) >= 2 else ''
            if 'api key not valid' in reason or 'api_key_invalid' in reason:
                raise ProviderError('Google báo API key không hợp lệ. Chạy python3 setup_key.py để nhập API key mới từ Google AI Studio, rồi tải lại trang.')
            if 'quota' in reason or 'resource_exhausted' in reason:
                raise ProviderError('Google báo hết quota. Kiểm tra quota và billing trong Google AI Studio.')
            raise ProviderError('Google đóng kết nối Lyria. Kiểm tra quyền truy cập model và billing trong Google AI Studio.')
        if opcode in (websocket.ABNF.OPCODE_TEXT, websocket.ABNF.OPCODE_BINARY):
            return json.loads(payload)


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, fmt, *args):
        # Do not log request bodies, headers, or provider errors.
        pass

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        super().end_headers()

    def local_request(self):
        if self.headers.get('Host') not in {'localhost:8000', '127.0.0.1:8000'}:
            return False
        origin = self.headers.get('Origin')
        return not origin or origin in {'http://localhost:8000', 'http://127.0.0.1:8000'}

    def json_response(self, status, data):
        payload = json.dumps(data).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def do_HEAD(self):
        if not self.local_request() or urlsplit(self.path).path not in PUBLIC:
            self.send_error(404)
            return
        super().do_HEAD()

    def do_GET(self):
        if not self.local_request():
            self.send_error(403)
            return
        path = urlsplit(self.path).path
        if path == '/api/music/config':
            self.json_response(200, {'configured': bool(api_key()), 'authenticated': True})
        elif path in PUBLIC:
            super().do_GET()
        else:
            self.send_error(404)

    def event(self, data):
        self.wfile.write((json.dumps(data) + '\n').encode())
        self.wfile.flush()

    def do_POST(self):
        if not self.local_request():
            self.send_error(403)
            return
        if self.path != '/api/music/generate':
            self.send_error(404)
            return
        key = api_key()
        if not key:
            self.json_response(503, {'message': 'Chưa có API key. Chạy python3 setup_key.py trong Terminal rồi tải lại trang.'})
            return
        try:
            size = int(self.headers.get('Content-Length', '0'))
            if not 0 < size <= 16000:
                raise ValueError()
            data = json.loads(self.rfile.read(size))
            genre = data.get('genre','techno')
            hits = data.get('hits')
            loop_bars = data.get('loopBars', 1)
            if not isinstance(hits,list) or not 2 <= len(hits) <= 200 or any(not isinstance(x,(int,float)) or isinstance(x,bool) or not 0 <= x < 1 for x in hits) or loop_bars not in (1,2,4,8):
                raise ValueError()
            bpm = int(data['bpm'])
            density = float(data.get('density', .8))
            brightness = float(data.get('brightness', .7))
            if genre not in PROMPTS or not 60 <= bpm <= 200 or not 0 <= density <= 1 or not 0 <= brightness <= 1:
                raise ValueError()
        except (ValueError, KeyError, TypeError):
            self.json_response(400, {'message': 'Invalid music settings.'})
            return
        if not LOCK.acquire(blocking=False):
            self.json_response(429, {'message': 'A generation is already running. Please wait.'})
            return
        ws = None
        try:
            self.send_response(200)
            self.send_header('Content-Type', 'application/x-ndjson')
            self.send_header('Connection', 'close')
            self.end_headers()
            self.close_connection = True
            self.event({'type': 'status', 'message': 'Connecting to Google Lyria…'})
            ws = websocket.create_connection(
                'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateMusic?key=' + quote(key, safe=''),
                timeout=30, suppress_origin=True)
            ws.send(json.dumps({'setup': {'model': 'models/lyria-realtime-exp'}}))
            setup = receive_json(ws)
            if 'setupComplete' not in setup:
                raise RuntimeError('provider_setup')
            request = music_request(genre, bpm, density, brightness, hits, loop_bars)
            ws.send(json.dumps({'clientContent': request['clientContent']}))
            ws.send(json.dumps({'musicGenerationConfig': request['musicGenerationConfig']}))
            ws.send(json.dumps({'playbackControl': 'PLAY'}))
            seconds = min(24, 8 * 4 * 60 / bpm)
            target = int(seconds * 48000) * 4
            total = 0
            deadline = time.monotonic() + 90
            while total < target and time.monotonic() < deadline:
                msg = receive_json(ws)
                if msg.get('error') or msg.get('filteredPrompt'):
                    raise RuntimeError('provider_rejected')
                for chunk in msg.get('serverContent', {}).get('audioChunks', []):
                    pcm = base64.b64decode(chunk['data'], validate=True)
                    pcm = pcm[:target-total]
                    pcm = pcm[:len(pcm)//4*4]
                    if not pcm:
                        continue
                    total += len(pcm)
                    self.event({'type': 'audio', 'sampleRate': 48000, 'channels': 2, 'data': base64.b64encode(pcm).decode(), 'progress': total/target})
            if total < target:
                raise RuntimeError('provider_timeout')
            self.event({'type': 'complete', 'source': 'lyria', 'genre': genre, 'bpm': bpm, 'seconds': total / (48000*4)})
        except (BrokenPipeError, ConnectionResetError):
            pass
        except Exception as exc:
            # Never echo exception text: provider URLs can contain the API key.
            status = getattr(exc, 'status_code', None)
            if isinstance(exc, ProviderError):
                message = str(exc)
            elif status in (400, 401, 403):
                message = 'Google từ chối kết nối. Kiểm tra API key, quyền truy cập Lyria và billing trong Google AI Studio.'
            elif status == 429:
                message = 'Google đang giới hạn quota. Kiểm tra billing/quota rồi thử lại.'
            else:
                message = 'Không tạo được nhạc từ Lyria. Kiểm tra kết nối, API key và quyền truy cập model rồi thử lại.'
            try:
                self.event({'type': 'error', 'message': message})
            except (BrokenPipeError, ConnectionResetError):
                pass
        finally:
            if ws:
                ws.close()
            LOCK.release()

if __name__ == '__main__':
    server = ThreadingHTTPServer(('127.0.0.1', 8000), Handler)
    print('AFTERHOURS: http://localhost:8000', flush=True)
    print('API key: ' + ('configured' if api_key() else 'missing — run python3 setup_key.py'), flush=True)
    server.serve_forever()
