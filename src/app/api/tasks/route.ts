import { NextResponse } from 'next/server';
import { createTask, getAllTasks } from '@/lib/taskService';

export async function GET() {
  const tasks = await getAllTasks();
  return NextResponse.json({ tasks });
}

export async function POST(request: Request) {
  const body = await request.json();
  const title = body?.title as string;
  if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

  const task = await createTask(title);
  return NextResponse.json({ task }, { status: 201 });
}
