import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Heart, Clock, User, Calendar, Star, Trash2, ChevronRight, Smartphone } from 'lucide-react';
import { MobileCard } from '../components/MobileCard';
import { mobilesData } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export function DashboardPage() {
  const { user, searchHistory, removeFavorite } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'favorites' | 'history' | 'profile'>('favorites');

  const favoriteMobiles = mobilesData.filter(m => user?.favorites.includes(m.id));

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const handleRemoveFavorite = (mobileId: string, mobileName: string) => {
    removeFavorite(mobileId);
    toast.success(`Removed ${mobileName} from favorites`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
          <span className="text-xl">{user?.name[0].toUpperCase()}</span>
        </div>
        <div>
          <h1 className="text-gray-900 dark:text-white">My Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user?.email} · Member since {new Date(user?.createdAt || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Saved Favorites', value: favoriteMobiles.length, icon: <Heart className="w-5 h-5" />, color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
          { label: 'Search History', value: searchHistory.length, icon: <Clock className="w-5 h-5" />, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' },
          { label: 'Top Brand', value: favoriteMobiles[0]?.brand || '—', icon: <Star className="w-5 h-5" />, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
          { label: 'Phones Detected', value: searchHistory.length, icon: <Smartphone className="w-5 h-5" />, color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} mb-3`}>{icon}</div>
            <p className="text-2xl text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl mb-6 w-fit">
        {[
          { id: 'favorites', label: 'Favorites', icon: <Heart className="w-4 h-4" />, count: favoriteMobiles.length },
          { id: 'history', label: 'History', icon: <Clock className="w-4 h-4" />, count: searchHistory.length },
          { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
        ].map(({ id, label, icon, count }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === id
                ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {icon}
            {label}
            {count !== undefined && count > 0 && (
              <span className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs px-1.5 py-0.5 rounded-full">
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'favorites' && (
        <div>
          {favoriteMobiles.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
              <Heart className="w-12 h-12 text-gray-200 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No favorites yet</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition-colors"
              >
                Browse Phones
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {favoriteMobiles.map(mobile => (
                <div key={mobile.id} className="relative group">
                  <MobileCard mobile={mobile} onCompare={m => navigate('/compare', { state: { preselected: m.id } })} />
                  <button
                    onClick={() => handleRemoveFavorite(mobile.id, mobile.fullName)}
                    className="absolute top-14 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
                    aria-label="Remove favorite"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
          {searchHistory.length === 0 ? (
            <div className="text-center py-16">
              <Clock className="w-12 h-12 text-gray-200 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No search history yet</p>
            </div>
          ) : (
            <>
              <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30">
                <h3 className="text-gray-900 dark:text-white">Recent Detections</h3>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-slate-700/50">
                {searchHistory.map(item => {
                  const confPct = Math.round(item.confidence * 100);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors group"
                    >
                      {/* Uploaded image or phone image */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-700 flex-shrink-0">
                        <img
                          src={item.imageUrl || mobilesData.find(m => m.id === item.mobileId)?.images[0]}
                          alt={item.mobileFullName}
                          className="w-full h-full object-cover"
                          onError={e => {
                            const img = e.target as HTMLImageElement;
                            img.src = mobilesData.find(m => m.id === item.mobileId)?.images[0] || '';
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 dark:text-gray-100 truncate">{item.mobileFullName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(item.searchDate)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        {/* Confidence badge */}
                        <div className={`text-xs px-2.5 py-1 rounded-full ${
                          item.confidence >= 0.7
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                        }`}>
                          {confPct}% confidence
                        </div>

                        <button
                          onClick={() => navigate(`/results?id=${item.mobileId}`)}
                          className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 transition-opacity"
                        >
                          View <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
            <h3 className="text-gray-900 dark:text-white mb-5">Account Information</h3>
            <div className="space-y-4">
              {[
                { label: 'Full Name', value: user?.name },
                { label: 'Email Address', value: user?.email },
                { label: 'Account Role', value: user?.role === 'admin' ? '⭐ Administrator' : '👤 Standard User' },
                { label: 'Member Since', value: new Date(user?.createdAt || '').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-slate-700/50 last:border-0">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                  <span className="text-sm text-gray-800 dark:text-gray-100">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
            <h3 className="text-gray-900 dark:text-white mb-5">Activity Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                <Heart className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-lg text-gray-900 dark:text-white">{favoriteMobiles.length}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phones in favorites</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl">
                <Smartphone className="w-8 h-8 text-indigo-500" />
                <div>
                  <p className="text-lg text-gray-900 dark:text-white">{searchHistory.length}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total detections</p>
                </div>
              </div>
              {searchHistory.length > 0 && (
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <Star className="w-8 h-8 text-amber-500" />
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {(searchHistory.reduce((a, h) => a + h.confidence, 0) / searchHistory.length * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Average AI confidence</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
