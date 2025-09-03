import { Prisma } from "@prisma/client";

export const awesomeManyPayload: Prisma.AwesomeListSelect = {
  id: true,
  name: true,
  repositoryUrl: true,
  description: true,
  stars: true,
  forks: true,
  owner: true,
  contributors: true,
};
