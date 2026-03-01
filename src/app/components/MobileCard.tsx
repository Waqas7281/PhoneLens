import React from 'react';
import { Link } from 'react-router';
import { Star, Heart, GitCompare, ChevronRight } from 'lucide-react';
import { Mobile } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

interface MobileCardProps {
  mobile: Mobile;
  onCompare?: (mobile: Mobile) => void;
  showCompareBtn?: boolean;
  compact?: boolean;
}

export function MobileCard({ mobile, onCompare, showCompareBtn = true, compact = false }: MobileCardProps) {
  const { isFavorite, addFavorite, removeFavorite, isAuthenticated } = useAuth();
  const fav = isFavorite(mobile.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please sign in to save favorites');
      return;
    }
    if (fav) {
      removeFavorite(mobile.id);
      toast.success(`Removed ${mobile.fullName} from favorites`);
    } else {
      addFavorite(mobile.id);
      toast.success(`Saved ${mobile.fullName} to favorites`);
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCompare) onCompare(mobile);
  };

  return (
    <Link
      to={`/results?id=${mobile.id}`}
      className={`group block bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-slate-900/50 border border-gray-100 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1 ${compact ? 'p-3' : ''}`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600 ${compact ? 'h-36 rounded-xl mb-2' : 'h-52'}`}>
        <img
          src={mobile.images[0]}
          alt={mobile.fullName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            fav
              ? 'bg-red-500 text-white shadow-md shadow-red-200 dark:shadow-red-900/50'
              : 'bg-white/90 dark:bg-slate-700/90 text-gray-400 hover:text-red-500 dark:hover:text-red-400'
          }`}
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
        </button>

        {/* Brand Badge */}
        <div className="absolute bottom-2 left-2">
          <span className="text-xs bg-white/90 dark:bg-slate-800/90 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full backdrop-blur-sm">
            {mobile.brand}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className={compact ? '' : 'p-4'}>
        <h3 className={`text-gray-900 dark:text-white truncate ${compact ? 'text-sm' : ''}`}>
          {compact ? mobile.model : mobile.fullName}
        </h3>

        {!compact && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-3 line-clamp-1">
            {mobile.processor} • {mobile.os}
          </p>
        )}

        {/* Rating + Price */}
        <div className={`flex items-center justify-between ${compact ? 'mt-1' : ''}`}>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs text-gray-600 dark:text-gray-400">{mobile.rating}</span>
          </div>
          <span className={`text-indigo-600 dark:text-indigo-400 ${compact ? 'text-sm' : ''}`}>
            ${mobile.price.toLocaleString()}
          </span>
        </div>

        {/* Action Buttons */}
        {!compact && showCompareBtn && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-slate-700">
            <button
              onClick={handleCompare}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
            >
              <GitCompare className="w-3.5 h-3.5" />
              Compare
            </button>
            <div className="flex items-center gap-1 flex-1 justify-end">
              <span className="text-xs text-indigo-600 dark:text-indigo-400 group-hover:underline">View Details</span>
              <ChevronRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
