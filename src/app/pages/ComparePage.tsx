import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { GitCompare, Search, X, Printer, ChevronDown } from 'lucide-react';
import { CompareTable } from '../components/CompareTable';
import { mobilesData, Mobile } from '../data/mockData';
import { toast } from 'sonner';

function PhoneSelector({ selected, other, onSelect, label }: {
  selected: Mobile | null;
  other: Mobile | null;
  onSelect: (m: Mobile | null) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const results = mobilesData.filter(m => {
    if (other && m.id === other.id) return false;
    if (!query) return true;
    return m.fullName.toLowerCase().includes(query.toLowerCase()) || m.brand.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
      >
        {selected ? (
          <>
            <img src={selected.images[0]} alt={selected.fullName} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1 text-left min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
              <p className="text-sm text-gray-800 dark:text-gray-100 truncate">{selected.fullName}</p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400">${selected.price.toLocaleString()}</p>
            </div>
            <button
              onClick={e => { e.stopPropagation(); onSelect(null); }}
              className="w-7 h-7 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors flex-shrink-0"
              aria-label="Remove phone"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Select a phone to compare</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </>
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 z-30 overflow-hidden">
          <div className="p-3 border-b border-gray-100 dark:border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search phones..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-400"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {results.map(m => (
              <button
                key={m.id}
                onClick={() => { onSelect(m); setOpen(false); setQuery(''); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors text-left"
              >
                <img src={m.images[0]} alt={m.fullName} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 dark:text-gray-100 truncate">{m.fullName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{m.processor} · ${m.price.toLocaleString()}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {open && <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />}
    </div>
  );
}

export function ComparePage() {
  const location = useLocation();
  const state = location.state as { preselected?: string } | null;

  const [phone1, setPhone1] = useState<Mobile | null>(null);
  const [phone2, setPhone2] = useState<Mobile | null>(null);

  useEffect(() => {
    if (state?.preselected) {
      const found = mobilesData.find(m => m.id === state.preselected);
      if (found) setPhone1(found);
    }
  }, [state]);

  const handlePrint = () => {
    window.print();
    toast.info('Print dialog opened. Save as PDF to export.');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 dark:text-white flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-indigo-500" />
            Compare Phones
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Select two phones to see a side-by-side specification comparison
          </p>
        </div>
        {phone1 && phone2 && (
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Export PDF
          </button>
        )}
      </div>

      {/* Selectors */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <PhoneSelector
          selected={phone1}
          other={phone2}
          onSelect={setPhone1}
          label="Phone 1"
        />
        <PhoneSelector
          selected={phone2}
          other={phone1}
          onSelect={setPhone2}
          label="Phone 2"
        />
      </div>

      {/* Comparison Table */}
      {phone1 && phone2 ? (
        <CompareTable mobile1={phone1} mobile2={phone2} />
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
          <GitCompare className="w-16 h-16 text-gray-200 dark:text-slate-700 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {!phone1 && !phone2
              ? 'Select two phones above to start comparing'
              : `Select one more phone to compare with ${phone1?.fullName || phone2?.fullName}`}
          </p>
        </div>
      )}

      {/* Quick Compare Presets */}
      {!phone1 && !phone2 && (
        <div className="mt-10">
          <h3 className="text-gray-700 dark:text-gray-300 mb-4 text-sm">Popular Comparisons</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { p1: '1', p2: '3', label: 'iPhone 15 Pro Max vs Galaxy S24 Ultra' },
              { p1: '1', p2: '6', label: 'iPhone 15 Pro Max vs Pixel 8 Pro' },
              { p1: '3', p2: '8', label: 'Galaxy S24 Ultra vs OnePlus 12' },
              { p1: '8', p2: '10', label: 'OnePlus 12 vs Xiaomi 14 Pro' },
              { p1: '2', p2: '4', label: 'iPhone 14 Pro vs Galaxy S23+' },
              { p1: '6', p2: '10', label: 'Pixel 8 Pro vs Xiaomi 14 Pro' },
            ].map(({ p1, p2, label }) => {
              const m1 = mobilesData.find(m => m.id === p1)!;
              const m2 = mobilesData.find(m => m.id === p2)!;
              return (
                <button
                  key={label}
                  onClick={() => { setPhone1(m1); setPhone2(m2); }}
                  className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all text-left"
                >
                  <div className="flex -space-x-2 flex-shrink-0">
                    <img src={m1.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover border-2 border-white dark:border-slate-800" />
                    <img src={m2.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover border-2 border-white dark:border-slate-800" />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-tight">{label}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
