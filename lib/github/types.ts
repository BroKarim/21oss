export type Repository = {
  owner: string;
  name: string;
};

export type RepositoryData = {
  name: string;
  owner: string;
  description?: string;
  url: string;
  homepageUrl?: string;
  stars: number;
  forks: number;
  contributors: string[];
  watchers: number;
  pushedAt: Date;
  createdAt: Date;
  score: number;
  license: string | null;
  topics: string[];
};

export type RepositoryQueryResult = {
  name: string;
  owner: { login: string };
  description?: string;
  url: string;
  homepageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  pushedAt: Date;
  stargazerCount: number;
  forkCount: number;
  watchers: {
    totalCount: number;
  };
  mentionableUsers: {
    totalCount: number;
    nodes: { login: string }[]; // ✅ tambahin nodes di sini
  };
  licenseInfo: {
    spdxId: string;
  } | null;
  repositoryTopics: {
    nodes: Array<{
      topic: {
        name: string;
      };
    }>;
  };
};
