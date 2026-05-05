-- CreateTable
CREATE TABLE "ToolSearchMetadata" (
    "id" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "searchSummary" TEXT,
    "searchKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "searchUseCases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "searchAudiences" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "searchFeatures" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "searchStyleTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "searchSynonyms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "searchLocales" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "searchEmbeddingRef" TEXT,
    "searchScore" DOUBLE PRECISION,
    "searchManualBoost" INTEGER NOT NULL DEFAULT 0,
    "searchEnrichedAt" TIMESTAMP(3),
    "searchVersion" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ToolSearchMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ToolSearchMetadata_toolId_key" ON "ToolSearchMetadata"("toolId");

-- CreateIndex
CREATE INDEX "ToolSearchMetadata_toolId_idx" ON "ToolSearchMetadata"("toolId");

-- CreateIndex
CREATE INDEX "ToolSearchMetadata_searchEnrichedAt_idx" ON "ToolSearchMetadata"("searchEnrichedAt");

-- CreateIndex
CREATE INDEX "ToolSearchMetadata_searchVersion_idx" ON "ToolSearchMetadata"("searchVersion");

-- AddForeignKey
ALTER TABLE "ToolSearchMetadata"
ADD CONSTRAINT "ToolSearchMetadata_toolId_fkey"
FOREIGN KEY ("toolId") REFERENCES "Tool"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
