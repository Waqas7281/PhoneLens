import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Heart, Share2, MapPin, Calendar, Eye, MessageCircle, Phone, Shield, Package, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export function AdDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock data - in real app, fetch from API
  const ad = {
    id: '1',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800',
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800'
    ],
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    fullName: 'Apple iPhone 15 Pro Max',
    price: 350000,
    originalPrice: 450000,
    condition: 'Excellent',
    description: 'Barely used iPhone 15 Pro Max in pristine condition. Purchased 2 months ago. All accessories included. No scratches, dents, or any issues. Battery health is 100%. Comes with original box, charger, and case.',
    specifications: {
      ram: '8 GB',
      storage: '256 GB',
      color: 'Natural Titanium',
      purchaseDate: '2024-01-15',
      batteryHealth: '100%',
      screenCondition: 'Perfect',
      warranty: 'Yes - 10 months remaining'
    },
    accessories: ['Box', 'Charger', 'Earphones', 'Case', 'Screen Protector', 'Warranty Card'],
    location: {
      city: 'Lahore',
      area: 'DHA Phase 5'
    },
    seller: {
      name: 'Ahmed Khan',
      rating: 4.8,
      totalAds: 12,
      memberSince: '2023-06',
      verified: true
    },
    contact: {
      phone: '+92 300 1234567',
      whatsapp: '+92 300 1234567'
    },
    views: 245,
    posted: '2 days ago',
    negotiable: true,
    featured: true
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi! I'm interested in your ${ad.fullName} listed for PKR ${ad.price.toLocaleString()}`);
    window.open(`https://wa.me/${ad.contact.whatsapp.replace(/\s+/g, '')}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${ad.contact.phone}`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: ad.fullName,
        text: `Check out this ${ad.fullName} for PKR ${ad.price.toLocaleString()}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'Good': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Fair': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/marketplace')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Marketplace</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsFavorite(!isFavorite);
                  toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
                }}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorite 
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600' 
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700">
              {/* Main Image */}
              <div className="relative h-96 bg-gray-100 dark:bg-slate-700">
                <img
                  src={ad.images[currentImageIndex]}
                  alt={ad.fullName}
                  className="w-full h-full object-contain"
                />
                
                {/* Navigation Arrows */}
                {ad.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((currentImageIndex - 1 + ad.images.length) % ad.images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((currentImageIndex + 1) % ad.images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-800" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {ad.images.length}
                </div>

                {/* Featured Badge */}
                {ad.featured && (
                  <div className="absolute top-4 left-4 bg-amber-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                    FEATURED
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              <div className="flex gap-2 p-4 overflow-x-auto">
                {ad.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === idx
                        ? 'border-indigo-600 ring-2 ring-indigo-200 dark:ring-indigo-800'
                        : 'border-gray-200 dark:border-slate-600 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Description</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{ad.description}</p>
            </div>

            {/* Specifications */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Specifications</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(ad.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700">
                    <span className="text-gray-600 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Accessories */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Included Accessories</h2>
              <div className="flex flex-wrap gap-2">
                {ad.accessories.map((acc) => (
                  <span key={acc} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium">
                    {acc}
                  </span>
                ))}
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Safety Tips</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Meet in a safe, public location</li>
                    <li>• Check the item before payment</li>
                    <li>• Pay only after collecting the item</li>
                    <li>• Beware of unrealistic offers</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Price & Seller */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 sticky top-24">
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    PKR {ad.price.toLocaleString()}
                  </span>
                  {ad.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      PKR {ad.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {ad.negotiable && (
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">Negotiable</span>
                )}
                {ad.originalPrice && (
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                    {Math.round(((ad.originalPrice - ad.price) / ad.originalPrice) * 100)}% OFF
                  </div>
                )}
              </div>

              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${getConditionColor(ad.condition)}`}>
                {ad.condition} Condition
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleWhatsApp}
                  className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat on WhatsApp
                </button>
                <button
                  onClick={handleCall}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Call Seller
                </button>
              </div>

              {/* Location & Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-5 h-5" />
                  <span>{ad.location.area}, {ad.location.city}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-5 h-5" />
                  <span>Posted {ad.posted}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Eye className="w-5 h-5" />
                  <span>{ad.views} views</span>
                </div>
              </div>
            </div>

            {/* Seller Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Seller Information</h3>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {ad.seller.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">{ad.seller.name}</span>
                    {ad.seller.verified && (
                      <Shield className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <div className="text-sm text-amber-500">★ {ad.seller.rating} rating</div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Member since</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(ad.seller.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total ads</span>
                  <span className="font-medium text-gray-900 dark:text-white">{ad.seller.totalAds}</span>
                </div>
              </div>

              <button className="w-full mt-4 py-2.5 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors">
                View All Ads
              </button>
            </div>

            {/* Report Ad */}
            <button className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Report this ad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
