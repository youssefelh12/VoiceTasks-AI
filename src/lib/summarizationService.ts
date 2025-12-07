import { openai, textModel } from './openaiClient';

export type LLMTask = {
  title: string;
  status?: 'open' | 'done';
};

export type SummarizationResult = {
  originalText: string;
  summary: string;
  tasks: LLMTask[];
};

function parseModelJson(content: string | null | undefined) {
  if (!content) return null;
  const cleaned = content
    .trim()
    .replace(/^```json\n?/i, '')
    .replace(/```$/, '');
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse LLM JSON', err, content);
    return null;
  }
}

export async function summarizeAndExtractTasks(transcriptionText: string): Promise<SummarizationResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set. Cannot summarize audio.');
  }

  const systemPrompt =
    'You are an assistant that turns messy spoken notes into clear actionable tasks. ' +
    'Return concise summaries and a list of tasks as valid JSON.';

  const userPrompt = `Input note:\n${transcriptionText}\n\n` +
    '1) Briefly summarize the note in 1-3 sentences.\n' +
    '2) Extract a list of concrete tasks. Each task must be short and start with a verb.\n' +
    '3) Respond in strict JSON format:\n' +
    '{\n  "summary": "short summary",\n  "tasks": [\n    { "title": "Task one" },\n    { "title": "Task two" }\n  ]\n}`;

  const completion = await openai.chat.completions.create({
    model: textModel,
    temperature: 0.2,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  const parsed = parseModelJson(content);
  if (!parsed || typeof parsed.summary !== 'string' || !Array.isArray(parsed.tasks)) {
    throw new Error('Model response was not valid JSON.');
  }

  const normalizedTasks: LLMTask[] = parsed.tasks
    .filter((t: unknown) => typeof (t as LLMTask).title === 'string')
    .map((t: LLMTask) => ({ title: t.title.trim(), status: 'open' }));

  return {
    originalText: transcriptionText,
    summary: parsed.summary,
    tasks: normalizedTasks,
  };
}
