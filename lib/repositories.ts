import { slugify } from "@primoui/utils";
import type { Prisma } from "@prisma/client";
import { githubClient } from "@/services/github";

/**
 * Fetches the repository data for a tool and returns the data
 * in a format that can be used to update the tool.
 *
 * @param repository - The repository to fetch the data for.
 * @returns The repository data for the tool.
 */
export const getToolRepositoryData = async (repository: string) => {
  const repo = await githubClient.queryRepository(repository);

  if (!repo) return null;

  return {
    stars: repo.stars,
    forks: repo.forks,
    firstCommitDate: repo.createdAt,
    lastCommitDate: repo.pushedAt,

    // License
    license: repo.license
      ? {
          connectOrCreate: {
            where: { name: repo.license },
            create: { name: repo.license, slug: slugify(repo.license).replace(/-0$/, "") },
          },
        }
      : undefined,
  } satisfies Prisma.ContentUpdateInput;
};
