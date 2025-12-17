"use server";

import { findCuratedLists, findCuratedListByUrl } from "./queries";

export async function getCuratedLists() {
  return await findCuratedLists();
}

export async function getCuratedListByUrl(url: string) {
  const list = await findCuratedListByUrl(url);
  if (!list) {
    return null;
  }
  return list;
}
