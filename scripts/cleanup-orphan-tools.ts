// scripts/cleanup-orphan-tools.ts
import { PrismaClient, ToolType } from "@prisma/client";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const prisma = new PrismaClient();

const DRY_RUN = false;
const S3_BUCKET = process.env.S3_BUCKET!;

const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

function getS3KeyFromUrl(url: string) {
  const u = new URL(url);
  return u.pathname.replace(/^\/+/, "");
}

async function main() {
  const tools = await prisma.tool.findMany({
    where: {
      type: ToolType.Tool,
      curatedLists: { none: {} },
    },
    select: {
      id: true,
      name: true,
      screenshots: { select: { id: true, imageUrl: true } },
    },
  });

  console.log(`🔍 Found ${tools.length} orphan tools`);

  for (const tool of tools) {
    console.log(`\n🧹 ${tool.name}`);

    // 1. Delete screenshots (S3 + DB)
    for (const shot of tool.screenshots) {
      const key = getS3KeyFromUrl(shot.imageUrl);
      console.log(` - image: ${key}`);

      if (!DRY_RUN) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: S3_BUCKET,
            Key: key,
          })
        );
      }
    }

    if (!DRY_RUN) {
      await prisma.toolScreenshot.deleteMany({
        where: { toolId: tool.id },
      });

      // 2. Clear M2M relations
      await prisma.tool.update({
        where: { id: tool.id },
        data: {
          categories: { set: [] },
          platforms: { set: [] },
          stacks: { set: [] },
          curatedLists: { set: [] },
        },
      });

      // 3. Delete dependent tables
      await prisma.like.deleteMany({ where: { toolId: tool.id } });
      await prisma.report.deleteMany({ where: { toolId: tool.id } });

      // 4. Finally delete tool
      await prisma.tool.delete({ where: { id: tool.id } });
    }
  }

  console.log(DRY_RUN ? "\n⚠️ DRY RUN ONLY" : "\n✅ CLEANUP DONE");
}

main()
  .catch(console.error)
  .finally(async () => prisma.$disconnect());
