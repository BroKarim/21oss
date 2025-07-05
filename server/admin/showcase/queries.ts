import { db } from "@/services/db";

export const findAlternativeList = async () => {
  return db.content.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
};
