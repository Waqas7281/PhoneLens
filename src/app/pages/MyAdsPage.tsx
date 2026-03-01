import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Edit, Trash2, Eye, MessageCircle, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface MyAd {
  id: string;
  image: string;
  brand: string;
  model: string;
  price: number;
  status: 'Active' | 'Sold' | 'Inactive';
  views: number;
  inquiries: number;
  posted: string;
  condition: string;
}

const mockAds: MyAd[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    price: 350000,
    status: 'Active',
    views: 245,
    inquiries: 12,
    posted: '2 days ago',
    condition: 'Excellent'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
    brand: 'Samsung',
    model: 'Galaxy S23 Ultra',
    price: 280000,
    status: 'Active',
    views: 189,
    inquiries: 8,
    posted: '5 days ago',
    condition: 'Good'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400',
    brand: 'Google',
    model: 'Pixel 8 Pro',
    price: 220000,
    status: 'Sold',
    views: 312,
    inquiries: 24,
    posted: '15 days ago',
    condition: 'Excellent'
  }
];

export function MyAdsPage() {
  const navigate = useNavigate();
  const [ads, setAds] = useState(mockAds);
  const [filter, setFilter] = useState<'all' | 'Active' | 'Sold' | 'Inactive'>('all');

  const filteredAds = filter === 'all' ? ads : ads.filter(ad => ad.status === filter);

  const activeAds = ads.filter(ad => ad.status === 'Active').length;
  const soldAds = ads.filter(ad => ad.status === 'Sold').length;
  const totalViews = ads.reduce((sum, ad) => sum + ad.views, 0);
  const totalInquiries = ads.reduce((sum, ad) => sum + ad.inquiries, 0);

  const handleDelete = (id: string, model: string) => {
    if (confirm(`Are you sure you want to delete ${model}?`)) {
      setAds(ads.filter(ad => ad.id !== id));
      toast.success('Ad deleted successfully');
    }
  };

  const handleMarkSold = (id: string, model: string) => {
    setAds(ads.map(ad => 
      ad.id === id ? { ...ad, status: 'Sold' as const } : ad
    ));
    toast.success(`${model} marked as sold!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'Sold': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Inactive': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle className="w-4 h-4" />;
      case 'Sold': return <CheckCircle className="w-4 h-4" />;
      case 'Inactive': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Ads</h1>
              <p className="text-indigo-100">Manage your mobile listings</p>
            </div>
            <button
              onClick={() => navigate('/sell')}
              className="px-6 py-3 bg-white text-indigo-600 hover:bg-indigo-50 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create New Ad
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Ads', value: activeAds, icon: <CheckCircle className="w-5 h-5" /> },
              { label: 'Sold', value: soldAds, icon: <CheckCircle className="w-5 h-5" /> },
              { label: 'Total Views', value: totalViews, icon: <Eye className="w-5 h-5" /> },
              { label: 'Inquiries', value: totalInquiries, icon: <MessageCircle className="w-5 h-5" /> }
            ].map(({ label, value, icon }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 text-white/80 mb-2">
                  {icon}
                  <span className="text-sm">{label}</span>
                </div>
                <p className="text-3xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
            {(['all', 'Active', 'Sold', 'Inactive'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                {f === 'all' ? 'All Ads' : f}
                {f !== 'all' && (
                  <span className="ml-2 bg-white/20 px-1.5 rounded-full text-xs">
                    {ads.filter(ad => ad.status === f).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Ads List */}
        {filteredAds.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No ads found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === 'all' 
                ? "You haven't created any ads yet" 
                : `No ${filter.toLowerCase()} ads`
              }
            </p>
            <button
              onClick={() => navigate('/sell')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Your First Ad
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAds.map((ad) => (
              <div
                key={ad.id}
                className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-48 h-48 bg-gray-100 dark:bg-slate-700 flex-shrink-0">
                    <img
                      src={ad.image}
                      alt={`${ad.brand} ${ad.model}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                          {ad.brand} {ad.model}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">{ad.condition} condition</p>
                      </div>
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(ad.status)}`}>
                        {getStatusIcon(ad.status)}
                        {ad.status}
                      </div>
                    </div>

                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                      PKR {ad.price.toLocaleString()}
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        <span>{ad.views} views</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4" />
                        <span>{ad.inquiries} inquiries</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>Posted {ad.posted}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => navigate(`/marketplace/${ad.id}`)}
                        className="px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      
                      {ad.status === 'Active' && (
                        <>
                          <button
                            onClick={() => toast.info('Edit functionality coming soon')}
                            className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg font-medium transition-colors flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleMarkSold(ad.id, `${ad.brand} ${ad.model}`)}
                            className="px-4 py-2 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg font-medium transition-colors flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark Sold
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => handleDelete(ad.id, `${ad.brand} ${ad.model}`)}
                        className="px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Tips to Sell Faster</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <li>• Upload clear, high-quality images from multiple angles</li>
            <li>• Set competitive pricing based on condition and market</li>
            <li>• Respond quickly to buyer inquiries</li>
            <li>• Provide accurate and honest descriptions</li>
            <li>• Keep your ad active and refresh it periodically</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
