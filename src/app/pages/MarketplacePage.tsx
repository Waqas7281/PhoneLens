import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, SlidersHorizontal, Grid3x3, List, MapPin, Heart, Eye, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Ad {
  id: string;
  images: string[];
  brand: string;
  model: string;
  price: number;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  location: { city: string; area: string };
  seller: { name: string; rating: number };
  views: number;
  postedDays: number;
  featured: boolean;
  ram: string;
  storage: string;
}

const mockAds: Ad[] = [
  {
    id: '1',
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600'],
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    price: 1199,
    condition: 'Excellent',
    location: { city: 'Lahore', area: 'DHA Phase 5' },
    seller: { name: 'Ahmed Khan', rating: 4.8 },
    views: 245,
    postedDays: 2,
    featured: true,
    ram: '8 GB',
    storage: '256 GB'
  },
  {
    id: '2',
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600'],
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    price: 1099,
    condition: 'Good',
    location: { city: 'Lahore', area: 'Gulberg' },
    seller: { name: 'Ali Raza', rating: 4.5 },
    views: 189,
    postedDays: 5,
    featured: false,
    ram: '12 GB',
    storage: '512 GB'
  },
  {
    id: '3',
    images: ['https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600'],
    brand: 'Google',
    model: 'Pixel 8 Pro',
    price: 799,
    condition: 'Excellent',
    location: { city: 'Lahore', area: 'Johar Town' },
    seller: { name: 'Hassan Sheikh', rating: 4.9 },
    views: 156,
    postedDays: 1,
    featured: true,
    ram: '12 GB',
    storage: '256 GB'
  },
  {
    id: '4',
    images: ['https://images.unsplash.com/photo-1592286927505-675a0792e066?w=600'],
    brand: 'OnePlus',
    model: '12',
    price: 699,
    condition: 'Good',
    location: { city: 'Lahore', area: 'Model Town' },
    seller: { name: 'Sara Malik', rating: 4.6 },
    views: 98,
    postedDays: 3,
    featured: false,
    ram: '12 GB',
    storage: '256 GB'
  },
  {
    id: '5',
    images: ['https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600'],
    brand: 'Xiaomi',
    model: '14 Pro',
    price: 749,
    condition: 'Excellent',
    location: { city: 'Lahore', area: 'Bahria Town' },
    seller: { name: 'Usman Ali', rating: 4.7 },
    views: 134,
    postedDays: 4,
    featured: false,
    ram: '16 GB',
    storage: '512 GB'
  },
  {
    id: '6',
    images: ['https://images.unsplash.com/photo-1611791483458-bc4023a8dbe8?w=600'],
    brand: 'Apple',
    model: 'iPhone 14 Pro',
    price: 899,
    condition: 'Good',
    location: { city: 'Lahore', area: 'Wapda Town' },
    seller: { name: 'Fatima Noor', rating: 4.8 },
    views: 211,
    postedDays: 6,
    featured: false,
    ram: '6 GB',
    storage: '256 GB'
  }
];

export function MarketplacePage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 2000]);

  const brands = ['all', 'Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi'];
  const conditions = ['all', 'Excellent', 'Good', 'Fair', 'Poor'];

  const filteredAds = mockAds.filter(ad => {
    const matchSearch = !searchQuery || 
      ad.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchBrand = selectedBrand === 'all' || ad.brand === selectedBrand;
    const matchCondition = selectedCondition === 'all' || ad.condition === selectedCondition;
    const matchPrice = ad.price >= priceRange[0] && ad.price <= priceRange[1];
    
    return matchSearch && matchBrand && matchCondition && matchPrice;
  });

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'Good': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Fair': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
      case 'Poor': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleFavorite = (adId: string) => {
    toast.success('Added to favorites');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Mobile Marketplace</h1>
          <p className="text-indigo-100 text-lg">Buy and sell used mobile phones in your area</p>
          
          {/* Quick Stats */}
          <div className="flex gap-6 mt-6">
            {[
              { label: 'Active Ads', value: '500+' },
              { label: 'Happy Buyers', value: '2000+' },
              { label: 'Cities', value: '50+' }
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-indigo-200">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters Bar */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by brand or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg flex items-center gap-2 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="font-medium">Filters</span>
            </button>

            {/* View Toggle */}
            <div className="flex gap-2 bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 shadow-sm' : ''}`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow-sm' : ''}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 grid md:grid-cols-3 gap-4">
              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand === 'all' ? 'All Brands' : brand}</option>
                  ))}
                </select>
              </div>

              {/* Condition Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Condition</label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>{condition === 'all' ? 'All Conditions' : condition}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredAds.length}</span> results
          </p>
          <button
            onClick={() => navigate('/sell')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg"
          >
            + Sell Your Mobile
          </button>
        </div>

        {/* Ads Grid/List */}
        {filteredAds.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No ads found matching your criteria</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredAds.map((ad) => (
              <div
                key={ad.id}
                onClick={() => navigate(`/marketplace/${ad.id}`)}
                className={`bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all cursor-pointer group ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Image */}
                <div className={`relative ${viewMode === 'list' ? 'w-48 h-48' : 'h-56'} bg-gray-100 dark:bg-slate-700 overflow-hidden`}>
                  <img
                    src={ad.images[0]}
                    alt={`${ad.brand} ${ad.model}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {ad.featured && (
                    <div className="absolute top-3 left-3 bg-amber-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
                      FEATURED
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavorite(ad.id);
                    }}
                    className="absolute top-3 right-3 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className={`absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(ad.condition)}`}>
                    {ad.condition}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {ad.brand} {ad.model}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{ad.ram} RAM • {ad.storage}</p>
                    </div>
                  </div>

                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-3">
                    ${ad.price.toLocaleString()}
                  </p>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{ad.location.area}, {ad.location.city}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {ad.views} views
                      </div>
                      <div>• {ad.postedDays}d ago</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">by </span>
                      <span className="font-medium text-gray-900 dark:text-white">{ad.seller.name}</span>
                      <span className="text-amber-500 ml-1">★ {ad.seller.rating}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success('Opening WhatsApp...');
                      }}
                      className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
