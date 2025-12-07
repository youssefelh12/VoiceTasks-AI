import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sampleSummary = 'Initial sample tasks for VoiceTasks AI';
  await prisma.task.createMany({
    data: [
      { title: 'Review demo tasks UI', status: 'open', summaryId: sampleSummary },
      { title: 'Test audio recording flow', status: 'open', summaryId: sampleSummary },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
