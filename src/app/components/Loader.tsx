import React from 'react';
import { Cpu } from 'lucide-react';

interface LoaderProps {
  text?: string;
  fullPage?: boolean;
}

export function Loader({ text = 'Processing...', fullPage = false }: LoaderProps) {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-20 h-20">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-indigo-200 dark:border-indigo-900" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
        {/* Inner ring */}
        <div className="absolute inset-3 rounded-full border-4 border-transparent border-t-violet-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Cpu className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-700 dark:text-gray-200">{text}</p>
        <div className="flex items-center justify-center gap-1 mt-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 animate-pulse">
      <div className="h-52 bg-gray-200 dark:bg-slate-700" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/4" />
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}
