import { prisma } from './prismaClient';
import type { SummarizationResult } from './summarizationService';

export async function getAllTasks() {
  return prisma.task.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function createTasksFromLLMOutput(result: SummarizationResult) {
  if (!result.tasks?.length) return [];
  const createdTasks = await prisma.$transaction(
    result.tasks.map((task) =>
      prisma.task.create({
        data: {
          title: task.title,
          status: task.status ?? 'open',
          summaryId: result.summary,
        },
      })
    )
  );
  return createdTasks;
}

export async function updateTaskStatus(id: number, status: 'open' | 'done') {
  return prisma.task.update({
    where: { id },
    data: { status },
  });
}

export async function deleteTask(id: number) {
  return prisma.task.delete({ where: { id } });
}

export async function createTask(title: string) {
  return prisma.task.create({ data: { title, status: 'open' } });
}
