export type GitHubActivityTargetType = "profile" | "repo";

export type GitHubProfileTarget = {
  type: "profile";
  username: string;
  owner: string;
  repo: null;
  normalizedUrl: string;
};

export type GitHubRepoTarget = {
  type: "repo";
  username: null;
  owner: string;
  repo: string;
  normalizedUrl: string;
};

export type GitHubActivityTarget = GitHubProfileTarget | GitHubRepoTarget;

const RESERVED_GITHUB_SEGMENTS = new Set([
  "about",
  "account",
  "codespaces",
  "collections",
  "contact",
  "customer-stories",
  "enterprise",
  "events",
  "explore",
  "features",
  "gist",
  "github",
  "issues",
  "login",
  "marketplace",
  "mobile",
  "new",
  "notifications",
  "orgs",
  "organizations",
  "pricing",
  "pulls",
  "search",
  "security",
  "settings",
  "site",
  "sponsors",
  "team",
  "topics",
  "trending",
]);

const GITHUB_HOSTS = new Set(["github.com", "www.github.com"]);

function normalizeInputUrl(value: string) {
  const trimmed = value.trim();

  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function isValidGitHubSegment(value: string) {
  return /^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(value);
}

function isValidRepoSegment(value: string) {
  return /^[a-zA-Z0-9._-]+$/.test(value);
}

export function parseGitHubUrl(value: string): GitHubActivityTarget | null {
  const normalizedInput = normalizeInputUrl(value);

  if (!normalizedInput) return null;

  let url: URL;

  try {
    url = new URL(normalizedInput);
  } catch {
    return null;
  }

  if (!GITHUB_HOSTS.has(url.hostname.toLowerCase())) {
    return null;
  }

  const segments = url.pathname
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length === 0 || segments.length > 2) {
    return null;
  }

  const [ownerSegment, repoSegment] = segments;

  if (!ownerSegment) return null;

  const owner = ownerSegment.toLowerCase();

  if (!isValidGitHubSegment(owner) || RESERVED_GITHUB_SEGMENTS.has(owner)) {
    return null;
  }

  if (segments.length === 1) {
    return {
      type: "profile",
      username: owner,
      owner,
      repo: null,
      normalizedUrl: `https://github.com/${owner}`,
    };
  }

  if (!repoSegment || !isValidRepoSegment(repoSegment)) {
    return null;
  }

  const repo = repoSegment.replace(/\.git$/i, "");

  if (!repo) {
    return null;
  }

  return {
    type: "repo",
    username: null,
    owner,
    repo,
    normalizedUrl: `https://github.com/${owner}/${repo}`,
  };
}

export function isGitHubProfileUrl(value: string) {
  return parseGitHubUrl(value)?.type === "profile";
}

export function isGitHubRepoUrl(value: string) {
  return parseGitHubUrl(value)?.type === "repo";
}
