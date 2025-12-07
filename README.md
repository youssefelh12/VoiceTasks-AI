# VoiceTasks AI

VoiceTasks AI is a minimal full-stack MVP that lets you record short voice notes, transcribe them with Whisper, summarize and extract tasks with GPT-style models, and organize everything in a lightweight to-do interface.

## Features
- Record audio in the browser with a clear start/stop flow and timer.
- Backend endpoints to transcribe audio (`/api/transcribe`) and to summarize text (`/api/summarize`).
- Prisma + SQLite task storage with CRUD endpoints.
- React/Next.js UI that displays tasks, allows marking done, and shows loading/error states.
- Easily configurable OpenAI models via environment variables.

## Getting started

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
npm install
```

If npm install fails due to missing network access, configure your registry/proxy and retry.

### Environment variables
Copy the example file and fill in your keys:
```bash
cp .env.example .env
```
Update `.env` with:
- `OPENAI_API_KEY`: required for transcription and summarization.
- `OPENAI_SPEECH_MODEL`: optional, defaults to `whisper-1`.
- `OPENAI_TEXT_MODEL`: optional, defaults to `gpt-4o-mini`.
- `DATABASE_URL`: SQLite connection string (default `file:./dev.db`).

### Database setup
Run Prisma migrations to create the SQLite database:
```bash
npx prisma migrate dev --name init
```
Optionally seed sample tasks:
```bash
npx prisma db seed
```
(Uses `prisma/seed.ts`.)

### Development
Start the Next.js dev server:
```bash
npm run dev
```
Open http://localhost:3000 and allow microphone access to record a note.

### Production build
```bash
npm run build
npm start
```

## API overview
- `POST /api/transcribe`: accepts `file` (audio blob), transcribes, summarizes, creates tasks, and returns them.
- `POST /api/summarize`: accepts JSON `{ text }`, summarizes/extracts tasks, stores them, returns created tasks.
- `GET /api/tasks`: list tasks ordered by creation date.
- `POST /api/tasks`: create a simple task with `{ title }`.
- `PATCH /api/tasks/:id`: update status (`open`|`done`).
- `DELETE /api/tasks/:id`: remove a task.

## Notes
- The app expects valid OpenAI credentials. Errors surface in the UI and server logs when keys are missing.
- Audio uploads are limited to ~10MB via Next.js body size configuration; adjust `serverActions.bodySizeLimit` in `next.config.js` if needed.
- The UI uses Tailwind for quick styling and is mobile-friendly by default.
