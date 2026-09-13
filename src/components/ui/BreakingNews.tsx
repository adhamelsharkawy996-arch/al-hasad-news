'use client';

import { AlertCircle } from 'lucide-react';

interface BreakingNewsProps {
  title: string;
}

export default function BreakingNews({ title }: BreakingNewsProps) {
  return (
    <div className="bg-[var(--color-danger)] text-white py-2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold shrink-0">
          <AlertCircle size={14} />
          <span>عاجل</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap flex-1">
          <span className="ticker-animate inline-block">{title}</span>
        </div>
      </div>
    </div>
  );
}
