// scripts/merge-reactjs-to-react.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const react = await prisma.stack.findUnique({
    where: { slug: "react" },
  });

  const reactjs = await prisma.stack.findUnique({
    where: { slug: "reactjs" },
  });

  if (!react || !reactjs) {
    console.log("❌ react atau reactjs stack tidak ditemukan");
    return;
  }

  // ambil semua tool yang terhubung ke reactjs
  const toolsWithReactjs = await prisma.tool.findMany({
    where: {
      stacks: {
        some: { id: reactjs.id },
      },
    },
    select: { id: true },
  });

  // pindahkan relasi ke react
  for (const tool of toolsWithReactjs) {
    await prisma.tool.update({
      where: { id: tool.id },
      data: {
        stacks: {
          connect: { id: react.id },
          disconnect: { id: reactjs.id },
        },
      },
    });
  }

  // hapus stack reactjs
  await prisma.stack.delete({
    where: { id: reactjs.id },
  });

  console.log(`✅ Berhasil merge reactjs → react (${toolsWithReactjs.length} tools)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
