import type { GitHubActivityTarget } from "./parse-github-url";

export type ContributionDay = {
  date: string;
  count: number;
};

function seededNumber(seed: string, index: number) {
  let value = 0;

  for (let i = 0; i < seed.length; i += 1) {
    value = (value * 31 + seed.charCodeAt(i) + index) % 2147483647;
  }

  return value;
}

export function getActivityData(target: GitHubActivityTarget): ContributionDay[] {
  const items: ContributionDay[] = [];
  const today = new Date();

  for (let offset = 364; offset >= 0; offset -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - offset);

    const base = seededNumber(target.normalizedUrl, offset);
    const intensity = base % 11;
    const count = intensity < 4 ? 0 : intensity < 7 ? 1 : intensity < 9 ? 3 : 7;

    items.push({
      date: day.toISOString(),
      count,
    });
  }

  return items;
}
