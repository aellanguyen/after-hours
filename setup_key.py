"""Run in your own Terminal. API key is hidden and saved with owner-only permissions."""
from getpass import getpass
import os
from pathlib import Path

key = getpass('Paste your NEW Google AI Studio API key (hidden): ').strip()
if not key or any(c.isspace() for c in key):
    raise SystemExit('No valid value entered. Nothing saved.')
path = Path(__file__).resolve().parent / '.env'
fd = os.open(str(path), os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
os.fchmod(fd, 0o600)
with os.fdopen(fd, 'w') as file:
    file.write('GEMINI_API_KEY=' + key + '\n')
print('Key saved privately. Reload http://localhost:8000.')
