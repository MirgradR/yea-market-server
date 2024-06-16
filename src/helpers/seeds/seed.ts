import { faker } from '@faker-js/faker';
import { FileType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getRandomEnumValue<T>(enumObj: T): T[keyof T] {
  const enumValues = Object.values(enumObj) as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  return enumValues[randomIndex];
}

console.log('Seeding...');
const startTime = new Date();

async function main() {
  for (let i = 0; i < 1000; i++) {}
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    const endTime = new Date();
    const timeDiff = (endTime.getTime() - startTime.getTime()) / 1000;
    console.log(`Seeding finished. Time taken: ${timeDiff} seconds`);
  });
