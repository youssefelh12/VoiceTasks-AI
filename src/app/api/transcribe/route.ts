import { NextResponse } from 'next/server';
import { summarizeAndExtractTasks } from '@/lib/summarizationService';
import { createTasksFromLLMOutput } from '@/lib/taskService';
import { transcribeAudio } from '@/lib/transcriptionService';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('file');

    if (!(audioFile instanceof File)) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const transcription = await transcribeAudio(buffer, audioFile.type);
    const summary = await summarizeAndExtractTasks(transcription);
    const tasks = await createTasksFromLLMOutput(summary);

    return NextResponse.json({
      transcription,
      summary: summary.summary,
      tasks,
    });
  } catch (error) {
    console.error('Transcription error', error);
    return NextResponse.json(
      { error: 'Failed to process audio. Ensure OPENAI_API_KEY is set and audio is valid.' },
      { status: 500 }
    );
  }
}
