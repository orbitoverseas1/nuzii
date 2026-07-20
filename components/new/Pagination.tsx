"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination = ({ currentPage, totalPages, onPageChange, className }: Props) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="w-9 h-9 flex items-center justify-center rounded-full border border-nuziiRoseGold/30 text-nuziiText disabled:opacity-30 disabled:cursor-not-allowed hover:border-nuziiRoseGold hoverEffect"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium hoverEffect",
            page === currentPage
              ? "bg-nuziiRoseGold text-white"
              : "border border-nuziiRoseGold/30 text-nuziiText hover:border-nuziiRoseGold"
          )}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="w-9 h-9 flex items-center justify-center rounded-full border border-nuziiRoseGold/30 text-nuziiText disabled:opacity-30 disabled:cursor-not-allowed hover:border-nuziiRoseGold hoverEffect"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
