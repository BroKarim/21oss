import dotenv from "dotenv";

dotenv.config({ path: ".env.development.local" });
dotenv.config({ path: ".env" });

async function main() {
  const { DeleteObjectsCommand, ListObjectsV2Command } = await import("@aws-sdk/client-s3");
  const { s3Client } = await import("@/services/s3");
  const { env } = await import("@/env");

  async function deleteAllObjects() {
    let token: string | undefined;

    do {
      const res = await s3Client.send(
        new ListObjectsV2Command({
          Bucket: env.S3_BUCKET,
          ContinuationToken: token,
        })
      );

      const objects = (res.Contents ?? [])
        .filter((obj): obj is { Key: string } => !!obj.Key)
        .map((obj) => ({ Key: obj.Key }));

      if (objects.length) {
        await s3Client.send(
          new DeleteObjectsCommand({
            Bucket: env.S3_BUCKET,
            Delete: {
              Objects: objects,
              Quiet: true,
            },
          })
        );
      }

      token = res.NextContinuationToken;
    } while (token);
  }

  await deleteAllObjects();
  console.log(`Done deleting all objects from bucket ${env.S3_BUCKET}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
