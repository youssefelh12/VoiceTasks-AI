import { openai, speechModel } from './openaiClient';

export async function transcribeAudio(audioBuffer: Buffer, mimeType = 'audio/webm') {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set. Cannot transcribe audio.');
  }

  const file = new File([audioBuffer], 'voice-note.webm', { type: mimeType });

  const response = await openai.audio.transcriptions.create({
    file,
    model: speechModel,
  });

  return response.text.trim();
}
