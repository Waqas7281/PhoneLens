import React from 'react';
import { CheckCircle, XCircle, Minus } from 'lucide-react';
import { Mobile } from '../data/mockData';

interface CompareTableProps {
  mobile1: Mobile;
  mobile2: Mobile;
}

const compareFields: { key: keyof Mobile; label: string; type?: 'price' | 'rating' | 'number' | 'text' }[] = [
  { key: 'display', label: 'Display' },
  { key: 'processor', label: 'Processor' },
  { key: 'ram', label: 'RAM' },
  { key: 'storage', label: 'Storage' },
  { key: 'camera', label: 'Camera' },
  { key: 'battery', label: 'Battery' },
  { key: 'os', label: 'Operating System' },
  { key: 'network', label: 'Connectivity' },
  { key: 'dimensions', label: 'Dimensions' },
  { key: 'weight', label: 'Weight' },
  { key: 'releaseYear', label: 'Release Year', type: 'number' },
  { key: 'price', label: 'Price', type: 'price' },
  { key: 'rating', label: 'Rating', type: 'rating' },
];

function isDifferent(v1: unknown, v2: unknown): boolean {
  return String(v1) !== String(v2);
}

function getBetter(key: keyof Mobile, v1: unknown, v2: unknown): 'first' | 'second' | 'equal' {
  if (!isDifferent(v1, v2)) return 'equal';
  if (key === 'price') {
    return Number(v1) < Number(v2) ? 'first' : 'second';
  }
  if (key === 'rating' || key === 'releaseYear') {
    return Number(v1) > Number(v2) ? 'first' : 'second';
  }
  return 'equal';
}

export function CompareTable({ mobile1, mobile2 }: CompareTableProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-3 border-b border-gray-100 dark:border-slate-700">
        <div className="col-span-1 bg-gray-50 dark:bg-slate-700/50 px-4 py-4 flex items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Specification</span>
        </div>
        {[mobile1, mobile2].map((m, idx) => (
          <div key={m.id} className={`px-4 py-4 text-center ${idx === 0 ? 'bg-indigo-50 dark:bg-indigo-950/30' : 'bg-violet-50 dark:bg-violet-950/30'}`}>
            <div className="w-16 h-16 mx-auto mb-2 rounded-xl overflow-hidden bg-white dark:bg-slate-700 shadow-sm">
              <img src={m.images[0]} alt={m.fullName} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-200 leading-tight">{m.fullName}</p>
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-50 dark:divide-slate-700/50">
        {compareFields.map(({ key, label, type }) => {
          const v1 = mobile1[key];
          const v2 = mobile2[key];
          const diff = isDifferent(v1, v2);
          const better = getBetter(key, v1, v2);

          const renderValue = (v: unknown, isBetter: boolean) => {
            if (type === 'price') {
              return <span className={isBetter ? 'text-green-600 dark:text-green-400' : ''}>${Number(v).toLocaleString()}</span>;
            }
            if (type === 'rating') {
              return (
                <div className="flex items-center justify-center gap-1">
                  <span className={isBetter ? 'text-amber-500' : ''}>{String(v)}</span>
                  <span className="text-gray-400">/5</span>
                </div>
              );
            }
            return <span>{String(v)}</span>;
          };

          return (
            <div key={key} className={`grid grid-cols-3 ${diff ? 'bg-amber-50/50 dark:bg-amber-950/10' : ''}`}>
              <div className="px-4 py-3 bg-gray-50/80 dark:bg-slate-700/30 flex items-center">
                <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
                {diff && (
                  <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                )}
              </div>
              {[{ m: mobile1, side: 'first' as const }, { m: mobile2, side: 'second' as const }].map(({ m, side }) => {
                const val = m[key];
                const isBetter = better === side;
                const isWorse = diff && better !== 'equal' && !isBetter && (key === 'price' || key === 'rating' || key === 'releaseYear');
                return (
                  <div
                    key={m.id}
                    className={`px-4 py-3 text-center flex items-center justify-center gap-1 text-xs leading-relaxed ${
                      isBetter ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400' :
                      isWorse ? 'bg-red-50 dark:bg-red-950/10 text-red-700 dark:text-red-400' :
                      'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {isBetter && <CheckCircle className="w-3 h-3 flex-shrink-0" />}
                    {isWorse && <XCircle className="w-3 h-3 flex-shrink-0" />}
                    {!isBetter && !isWorse && diff && <Minus className="w-3 h-3 flex-shrink-0 text-gray-400" />}
                    <span>{renderValue(val, isBetter)}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-slate-700/30 border-t border-gray-100 dark:border-slate-700 flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" /> Better value</span>
        <span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-500" /> Lower value</span>
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Different specs</span>
      </div>
    </div>
  );
}
