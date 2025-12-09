"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Zap, Tag } from "lucide-react";

export interface Perk {
  id: string;
  name: string;
  logoUrl?: string | null;
  value?: string | null;
  description?: string | null;
  claimUrl?: string | null;
  tags: string[];
  isHot?: boolean;
}

interface PerksTableProps {
  title?: string;
  data: Perk[];
}

export function StuffTable({ data = [] }: PerksTableProps) {
  const [selectedPerk, setSelectedPerk] = useState<Perk | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const gridLayout = "240px 120px 200px 1fr 140px";

  const getTagColor = (tag: string) => {
    const colors = [
      "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "bg-purple-500/10 text-purple-500 border-purple-500/20",
      "bg-green-500/10 text-green-500 border-green-500/20",
      "bg-orange-500/10 text-orange-500 border-orange-500/20",
      "bg-pink-500/10 text-pink-500 border-pink-500/20",
      "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    ];
    const index = tag.length % colors.length;
    return colors[index];
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full">
      {/* Desktop View */}
      <div className="hidden lg:block bg-background border border-border/50 overflow-hidden rounded-xl shadow-sm relative">
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            {/* HEADER */}
            <div className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/40" style={{ display: "grid", gridTemplateColumns: gridLayout, alignItems: "center" }}>
              <div className="px-2">Resource</div>
              <div className="px-2">Value</div>
              <div className="px-2">Tags</div>
              <div className="px-2">Description</div>
              <div className="px-2 text-center"></div>
            </div>

            {/* BODY */}
            <div className="divide-y divide-border/20">
              {currentData.map((perk, i) => (
                <motion.div
                  key={perk.id}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: i * 0.05 }}
                  className="group relative hover:bg-muted/20 transition-colors cursor-pointer"
                  style={{ display: "grid", gridTemplateColumns: gridLayout, alignItems: "start" }}
                  onClick={() => setSelectedPerk(perk)}
                >
                  <div className="px-2 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-white border border-border/50 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                      {perk.logoUrl ? <img src={perk.logoUrl} alt={perk.name} className="w-full h-full object-contain" /> : <Zap className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <span className="font-medium text-foreground text-sm truncate">{perk.name}</span>
                  </div>

                  <div className="px-2 py-4">
                    <span className="text-sm font-medium text-foreground">{perk.value || "Free"}</span>
                  </div>

                  <div className="px-2 py-4 flex flex-wrap gap-1.5">
                    {perk.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getTagColor(tag)}`}>
                        {tag}
                      </span>
                    ))}
                    {perk.tags.length > 2 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border">+{perk.tags.length - 2}</span>}
                  </div>

                  <div className="px-2 py-4 pr-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">{perk.description}</p>
                  </div>

                  <div className="px-2 py-4 flex justify-center" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={perk.claimUrl || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md shadow hover:bg-primary/90 transition-all active:scale-95"
                    >
                      Claim Now
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet View */}
      <div className="lg:hidden space-y-4">
        {currentData.map((perk, i) => (
          <motion.div
            key={perk.id}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: i * 0.05 }}
            className="bg-background border border-border/50 rounded-xl shadow-sm p-4 space-y-3 cursor-pointer hover:border-border transition-colors"
            onClick={() => setSelectedPerk(perk)}
          >
            {/* Header: Logo + Name + Value */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-white border border-border/50 p-2 shrink-0 flex items-center justify-center overflow-hidden">
                {perk.logoUrl ? <img src={perk.logoUrl} alt={perk.name} className="w-full h-full object-contain" /> : <Zap className="w-5 h-5 text-muted-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-base">{perk.name}</h3>
                <p className="text-sm font-medium text-muted-foreground mt-0.5">{perk.value || "Free"}</p>
              </div>
            </div>

            {/* Tags */}
            {perk.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {perk.tags.map((tag) => (
                  <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getTagColor(tag)}`}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {perk.description && <p className="text-sm text-muted-foreground leading-relaxed">{perk.description}</p>}

            {/* Action Button */}
            <div onClick={(e) => e.stopPropagation()}>
              <a
                href={perk.claimUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg shadow hover:bg-primary/90 transition-all active:scale-95"
              >
                Claim Now
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* MODAL DETAIL */}
      <AnimatePresence>
        {selectedPerk && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedPerk(null)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="relative p-6 border-b border-border/40">
                <button onClick={() => setSelectedPerk(null)} className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white border shadow-sm p-2 flex items-center justify-center">
                    {selectedPerk.logoUrl ? <img src={selectedPerk.logoUrl} alt={selectedPerk.name} className="w-full h-full object-contain" /> : <Zap className="w-8 h-8 text-muted-foreground" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedPerk.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">Estimated Value:</span>
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">{selectedPerk.value || "Priceless"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPerk.tags.map((tag) => (
                      <span key={tag} className={`text-xs px-2.5 py-1 rounded-full border ${getTagColor(tag)}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                  <p className="text-sm leading-relaxed text-foreground/90">{selectedPerk.description}</p>
                </div>

                <div className="pt-2">
                  <a
                    href={selectedPerk.claimUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all"
                  >
                    Get this perk <ExternalLink className="w-4 h-4" />
                  </a>
                  <p className="text-[10px] text-center text-muted-foreground mt-3">By clicking, you will be redirected to the official partner site.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
