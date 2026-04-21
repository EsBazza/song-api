# SongTube Frontend

A YouTube-like web interface for the Song API, built with Vite + React, Tailwind CSS, and MUI.

## Prerequisites

- Node.js 18+
- npm 9+

## Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set `VITE_API_BASE_URL` to your API server URL (e.g. `http://localhost:8080`).
   
   If you leave `VITE_API_BASE_URL` empty, the Vite dev server proxy will forward `/alonzo` requests to `http://localhost:8080` automatically.

3. Start the development server:
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for production

```bash
npm run build
npm run preview
```

## Features

- 🎵 Browse all songs as a responsive card grid
- 🔍 Search songs by title, artist, album, or genre
- ▶️ Watch page with YouTube embed or HTML5 player
- 🌙 Dark theme matching YouTube's style
- ⚡ Loading skeletons and error states
- 📱 Responsive layout (mobile → desktop)

## API

The frontend connects to the Song API at `VITE_API_BASE_URL`. In development, a Vite proxy forwards `/alonzo` requests to `http://localhost:8080`.

### CORS

The backend already allows `http://localhost:5173`. To allow other origins, set the `ALLOWED_ORIGINS` environment variable on the backend.
