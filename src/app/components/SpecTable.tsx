import React from 'react';
import { Monitor, Cpu, HardDrive, Camera, Battery, Wifi, Package, Globe, DollarSign, Star, Calendar, Maximize2 } from 'lucide-react';
import { Mobile } from '../data/mockData';

interface SpecTableProps {
  mobile: Mobile;
}

const specRows = [
  { key: 'display', label: 'Display', icon: <Monitor className="w-4 h-4" />, color: 'text-blue-500' },
  { key: 'processor', label: 'Processor', icon: <Cpu className="w-4 h-4" />, color: 'text-violet-500' },
  { key: 'ram', label: 'RAM', icon: <HardDrive className="w-4 h-4" />, color: 'text-green-500' },
  { key: 'storage', label: 'Storage', icon: <Package className="w-4 h-4" />, color: 'text-amber-500' },
  { key: 'camera', label: 'Camera', icon: <Camera className="w-4 h-4" />, color: 'text-pink-500' },
  { key: 'battery', label: 'Battery', icon: <Battery className="w-4 h-4" />, color: 'text-emerald-500' },
  { key: 'os', label: 'Operating System', icon: <Globe className="w-4 h-4" />, color: 'text-sky-500' },
  { key: 'network', label: 'Connectivity', icon: <Wifi className="w-4 h-4" />, color: 'text-cyan-500' },
  { key: 'dimensions', label: 'Dimensions', icon: <Monitor className="w-4 h-4" />, color: 'text-gray-500' },
  { key: 'weight', label: 'Weight', icon: <Maximize2 className="w-4 h-4" />, color: 'text-gray-500' },
  { key: 'releaseYear', label: 'Release Year', icon: <Calendar className="w-4 h-4" />, color: 'text-indigo-500' },
];

export function SpecTable({ mobile }: SpecTableProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30">
        <h3 className="text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-2 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-violet-600 inline-block" />
          Full Specifications
        </h3>
      </div>

      <div className="divide-y divide-gray-50 dark:divide-slate-700/50">
        {specRows.map(({ key, label, icon, color }) => {
          const value = (mobile as any)[key];
          if (!value) return null;
          return (
            <div key={key} className="flex items-start gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center ${color}`}>
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
                <p className="text-sm text-gray-800 dark:text-gray-100 mt-0.5 leading-relaxed">{String(value)}</p>
              </div>
            </div>
          );
        })}

        {/* Price & Rating */}
        <div className="flex items-start gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-green-500">
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Price</p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-0.5">${mobile.price.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-start gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-amber-500">
            <Star className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Rating</p>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i <= Math.floor(mobile.rating) ? 'text-amber-400 fill-amber-400' : i - 0.5 <= mobile.rating ? 'text-amber-400 fill-amber-200' : 'text-gray-300 dark:text-gray-600'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{mobile.rating}/5</span>
            </div>
          </div>
        </div>

        {/* Available Colors */}
        {mobile.colors && mobile.colors.length > 0 && (
          <div className="flex items-start gap-4 px-5 py-3.5">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-indigo-500">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-pink-400 to-violet-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Available Colors</p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {mobile.colors.map(color => (
                  <span key={color} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full">
                    {color}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}