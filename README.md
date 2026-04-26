# Memory-of-Unsaid-things

A simple, functional browser app to save and manage "unsaid" thoughts locally.

## Features

- Add a memory
- Persist memories in `localStorage`
- Delete a single memory
- Clear all memories
- Open a read-only preview mode with seeded example memories

## Run locally

Because this is a static app, you can either:

1. Open `index.html` directly in your browser, or
2. Serve it locally:

```bash
python3 -m http.server 8000
```

Then visit:

- App: <http://localhost:8000>
- Preview mode: <http://localhost:8000/index.html?preview=1>
