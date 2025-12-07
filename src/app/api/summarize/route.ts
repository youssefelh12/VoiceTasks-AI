import { NextResponse } from 'next/server';
import { summarizeAndExtractTasks } from '@/lib/summarizationService';
import { createTasksFromLLMOutput } from '@/lib/taskService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = body?.text as string;
    if (!text) {
      return NextResponse.json({ error: 'Missing transcription text' }, { status: 400 });
    }

    const summary = await summarizeAndExtractTasks(text);
    const tasks = await createTasksFromLLMOutput(summary);

    return NextResponse.json({
      originalText: summary.originalText,
      summary: summary.summary,
      tasks,
    });
  } catch (error) {
    console.error('Summarization error', error);
    return NextResponse.json(
      { error: 'Failed to summarize text. Ensure OPENAI_API_KEY is set.' },
      { status: 500 }
    );
  }
}
