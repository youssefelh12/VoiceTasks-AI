import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

export const speechModel = process.env.OPENAI_SPEECH_MODEL || 'whisper-1';
export const textModel = process.env.OPENAI_TEXT_MODEL || 'gpt-4o-mini';

if (!apiKey) {
  console.warn('OPENAI_API_KEY is not set. Transcription and summarization will fail.');
}

export const openai = new OpenAI({ apiKey });
