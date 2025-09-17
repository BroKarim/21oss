"use server";

import { findCuratedLists } from "./queries";

export async function getCuratedLists() {
  return await findCuratedLists();
}


