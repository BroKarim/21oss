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
  } satisfies Prisma.ToolUpdateInput;
};

export async function getAwesomeRepositoryData(repositoryUrl: string): Promise<Prisma.AwesomeListUpdateInput | null> {
  try {
    const repo = await githubClient.queryRepository(repositoryUrl);
    if (!repo) return null;

    // Ambil semua data termasuk owner & contributors
    const { name, nameWithOwner, description, url, homepageUrl, stars, forks, contributors, watchers, pushedAt, createdAt, score, license, topics } = repo;

    return {
      name,
      description,
      repositoryUrl: url,
      websiteUrl: homepageUrl,
      stars,
      forks,
      contributors,
      watchers,
      lastCommitAt: pushedAt,
      firstCommitAt: createdAt,
      license,
      owner: nameWithOwner,
      topics,
      score,
    };
  } catch (error) {
    console.error("getAwesomeRepositoryData error:", error);
    return null;
  }
}
