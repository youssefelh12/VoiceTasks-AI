import { NextResponse } from 'next/server';
import { deleteTask, updateTaskStatus } from '@/lib/taskService';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const status = body?.status as 'open' | 'done';
  if (!['open', 'done'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const updated = await updateTaskStatus(Number(params.id), status);
  return NextResponse.json({ task: updated });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await deleteTask(Number(params.id));
  return NextResponse.json({ ok: true });
}
