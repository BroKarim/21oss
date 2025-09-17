"use server";

import { getRecentTools } from "@/server/web/tools/actions";
import * as curatedListActions from "@/server/web/curated-lists/actions";


export const sectionActions = {
  getRecentTools, 
  ...curatedListActions, 
};
