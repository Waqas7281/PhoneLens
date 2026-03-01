import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ArrowLeft, Package, DollarSign, Wrench, Phone, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Part {
  id: string;
  name: string;
  type: string;
  price: number;
  originalPrice: number;
  availability: 'In Stock' | 'Out of Stock' | 'On Order';
  quality: 'Original' | 'OEM' | 'Aftermarket';
  warranty: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  suppliers: number;
  imageUrl: string;
}

const mockParts: Part[] = [
  {
    id: '1',
    name: 'AMOLED Display Screen',
    type: 'Display',
    price: 280,
    originalPrice: 350,
    availability: 'In Stock',
    quality: 'Original',
    warranty: '6 months',
    difficulty: 'Hard',
    suppliers: 5,
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400'
  },
  {
    id: '2',
    name: 'Battery 5000mAh',
    type: 'Power',
    price: 85,
    originalPrice: 120,
    availability: 'In Stock',
    quality: 'OEM',
    warranty: '3 months',
    difficulty: 'Medium',
    suppliers: 8,
    imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400'
  },
  {
    id: '3',
    name: 'Rear Camera Module 200MP',
    type: 'Camera',
    price: 195,
    originalPrice: 250,
    availability: 'In Stock',
    quality: 'Original',
    warranty: '6 months',
    difficulty: 'Hard',
    suppliers: 3,
    imageUrl: 'https://images.unsplash.com/photo-1606166332253-c5a8d66a2fc5?w=400'
  },
  {
    id: '4',
    name: 'Back Glass Panel',
    type: 'Body',
    price: 65,
    originalPrice: 90,
    availability: 'In Stock',
    quality: 'Aftermarket',
    warranty: '1 month',
    difficulty: 'Easy',
    suppliers: 6,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
  },
  {
    id: '5',
    name: 'Charging Port Flex Cable',
    type: 'Connector',
    price: 25,
    originalPrice: 35,
    availability: 'In Stock',
    quality: 'OEM',
    warranty: '2 months',
    difficulty: 'Medium',
    suppliers: 10,
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400'
  },
  {
    id: '6',
    name: 'Front Camera 12MP',
    type: 'Camera',
    price: 55,
    originalPrice: 75,
    availability: 'On Order',
    quality: 'Original',
    warranty: '6 months',
    difficulty: 'Medium',
    suppliers: 4,
    imageUrl: 'https://images.unsplash.com/photo-1606166332253-c5a8d66a2fc5?w=400'
  }
];

export function PartsResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const state = location.state as { detection?: { brand: string; model: string; confidence: number }; imageUrl?: string } | null;

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setParts(mockParts);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredParts = filter === 'all' 
    ? parts 
    : parts.filter(p => p.availability === filter);

  const handleRequestQuote = (partName: string) => {
    toast.success(`Quote request sent for ${partName}`);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'In Stock': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'Out of Stock': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'On Order': return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600';
      case 'Medium': return 'text-amber-600';
      case 'Hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Finding spare parts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/spare-parts')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Available Spare Parts</h1>
                {state?.detection && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    For {state.detection.brand} {state.detection.model} 
                    <span className="ml-2 text-green-600">({Math.round(state.detection.confidence * 100)}% confidence)</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Detection Result Card */}
        {state?.detection && (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 mb-8 text-white">
            <div className="flex items-center gap-4">
              {state.imageUrl && (
                <img 
                  src={state.imageUrl} 
                  alt="Detected mobile" 
                  className="w-24 h-24 rounded-xl object-cover border-2 border-white/20"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Detection Successful</span>
                </div>
                <h2 className="text-2xl font-bold mb-1">
                  {state.detection.brand} {state.detection.model}
                </h2>
                <p className="text-white/80">Found {parts.length} compatible spare parts</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by:</span>
            {['all', 'In Stock', 'Out of Stock', 'On Order'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                {f === 'all' ? 'All Parts' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Parts Grid */}
        {filteredParts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No parts found with selected filter</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParts.map((part) => (
              <div
                key={part.id}
                className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-100 dark:bg-slate-700">
                  <img
                    src={part.imageUrl}
                    alt={part.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(part.availability)}`}>
                    {part.availability}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{part.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{part.type}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      part.quality === 'Original' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : part.quality === 'OEM'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {part.quality}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">${part.price}</span>
                    <span className="text-sm text-gray-400 line-through">${part.originalPrice}</span>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      {Math.round(((part.originalPrice - part.price) / part.originalPrice) * 100)}% OFF
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Warranty: {part.warranty}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Wrench className={`w-4 h-4 ${getDifficultyColor(part.difficulty)}`} />
                      <span className="text-gray-600 dark:text-gray-400">
                        Installation: <span className={getDifficultyColor(part.difficulty)}>{part.difficulty}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">{part.suppliers} suppliers available</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRequestQuote(part.name)}
                      disabled={part.availability === 'Out of Stock'}
                      className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <DollarSign className="w-4 h-4" />
                      Request Quote
                    </button>
                    <button className="p-2.5 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                      <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Not sure which part you need? Contact our support team for expert guidance.
              </p>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
