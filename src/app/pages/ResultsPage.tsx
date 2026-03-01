import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { CheckCircle, AlertCircle, Heart, GitCompare, MessageCircle, Search, ArrowLeft, Share2, Star, ChevronRight } from 'lucide-react';
import { SpecTable } from '../components/SpecTable';
import { MobileCard } from '../components/MobileCard';
import { Loader } from '../components/Loader';
import { mobilesData, Mobile } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isFavorite, addFavorite, removeFavorite, isAuthenticated } = useAuth();

  const [mobile, setMobile] = useState<Mobile | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fromUpload, setFromUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [manualSearch, setManualSearch] = useState('');
  const [manualResults, setManualResults] = useState<Mobile[]>([]);
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    setLoading(true);
    const state = location.state as { detectedMobile?: Mobile; confidence?: number; imageUrl?: string; fromUpload?: boolean } | null;
    const idParam = searchParams.get('id');

    setTimeout(() => {
      if (state?.detectedMobile) {
        setMobile(state.detectedMobile);
        setConfidence(state.confidence || 0);
        setImageUrl(state.imageUrl || null);
        setFromUpload(state.fromUpload || false);
        if ((state.confidence || 0) < 0.7) setShowManual(true);
      } else if (idParam) {
        const found = mobilesData.find(m => m.id === idParam);
        setMobile(found || null);
        setConfidence(1);
        setFromUpload(false);
      }
      setLoading(false);
    }, 500);
  }, [location.state, searchParams]);

  const similarMobiles = mobile
    ? mobilesData.filter(m => m.brand === mobile.brand && m.id !== mobile.id)
    : [];

  const handleSearch = (q: string) => {
    setManualSearch(q);
    if (q.length >= 2) {
      const results = mobilesData.filter(m =>
        m.fullName.toLowerCase().includes(q.toLowerCase()) ||
        m.brand.toLowerCase().includes(q.toLowerCase()) ||
        m.model.toLowerCase().includes(q.toLowerCase())
      );
      setManualResults(results);
    } else {
      setManualResults([]);
    }
  };

  const handleFavorite = () => {
    if (!isAuthenticated) { toast.error('Please sign in to save favorites'); return; }
    if (!mobile) return;
    if (isFavorite(mobile.id)) {
      removeFavorite(mobile.id);
      toast.success('Removed from favorites');
    } else {
      addFavorite(mobile.id);
      toast.success('Saved to favorites ❤️');
    }
  };

  const handleWhatsApp = () => {
    const WHATSAPP_NUMBER = '923001234567';
    const msg = encodeURIComponent(`Hi! I'm interested in the ${mobile?.fullName} (Price: $${mobile?.price}). Could you provide more details?`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share && mobile) {
      navigator.share({ title: mobile.fullName, text: `Check out the ${mobile.fullName} specs!`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) return <Loader text="Loading results..." />;

  const confidencePct = Math.round(confidence * 100);
  const isHighConfidence = confidence >= 0.7;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <button onClick={() => navigate('/')} className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Home
        </button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 dark:text-gray-200">Detection Results</span>
      </div>

      {/* Confidence Banner */}
      {fromUpload && (
        <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl mb-6 ${
          isHighConfidence
            ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800'
            : 'bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800'
        }`}>
          {isHighConfidence
            ? <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            : <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          }
          <div className="flex-1">
            <p className={`text-sm ${isHighConfidence ? 'text-green-800 dark:text-green-300' : 'text-amber-800 dark:text-amber-300'}`}>
              {isHighConfidence
                ? `AI detected with ${confidencePct}% confidence — Hugging Face model matched this device.`
                : `Low confidence (${confidencePct}%). Please search manually below for best results.`
              }
            </p>
          </div>
          {/* Progress bar */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${isHighConfidence ? 'bg-green-500' : 'bg-amber-500'}`}
                style={{ width: `${confidencePct}%` }}
              />
            </div>
            <span className={`text-sm font-medium ${isHighConfidence ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>
              {confidencePct}%
            </span>
          </div>
        </div>
      )}

      {/* Low Confidence Manual Search */}
      {showManual && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 mb-6">
          <h3 className="text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-500" />
            Search Manually
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Type phone name, brand or model..."
              value={manualSearch}
              onChange={e => handleSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-400 text-sm"
            />
          </div>
          {manualResults.length > 0 && (
            <div className="mt-3 space-y-2">
              {manualResults.map(m => (
                <button
                  key={m.id}
                  onClick={() => { setMobile(m); setConfidence(1); setShowManual(false); setManualSearch(''); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors text-left"
                >
                  <img src={m.images[0]} alt={m.fullName} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <p className="text-sm text-gray-800 dark:text-gray-100">{m.fullName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">${m.price} · {m.os}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          {manualSearch.length >= 2 && manualResults.length === 0 && (
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 text-center py-3">No results found for "{manualSearch}"</p>
          )}
        </div>
      )}

      {/* Main Results */}
      {mobile ? (
        <div className="space-y-8">
          {/* Phone Card */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Image + Info */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
              {/* Upload preview or phone image */}
              <div className="h-72 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-700 dark:to-slate-600 relative overflow-hidden">
                {fromUpload && imageUrl ? (
                  <>
                    <img src={imageUrl} alt="Uploaded" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                    {isHighConfidence && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow">
                        <CheckCircle className="w-3 h-3" /> Detected
                      </div>
                    )}
                  </>
                ) : (
                  <img src={mobile.images[0]} alt={mobile.fullName} className="w-full h-full object-cover" />
                )}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">{mobile.brand}</span>
                    <h2 className="text-gray-900 dark:text-white mt-2">{mobile.fullName}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl text-indigo-600 dark:text-indigo-400">${mobile.price.toLocaleString()}</p>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{mobile.rating}/5</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5">{mobile.description}</p>

                {/* Quick specs */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: 'Processor', value: mobile.processor },
                    { label: 'RAM', value: mobile.ram },
                    { label: 'Camera', value: mobile.camera.split('+')[0].trim() },
                    { label: 'Battery', value: mobile.battery.split(',')[0] },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
                      <p className="text-sm text-gray-800 dark:text-gray-100 mt-0.5 truncate">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleFavorite}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all text-sm ${
                      isFavorite(mobile.id)
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                        : 'border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite(mobile.id) ? 'fill-current' : ''}`} />
                    {isFavorite(mobile.id) ? 'Saved' : 'Favorite'}
                  </button>
                  <button
                    onClick={() => navigate('/compare', { state: { preselected: mobile.id } })}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors text-sm"
                  >
                    <GitCompare className="w-4 h-4" />
                    Compare
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white transition-colors text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Spec Table */}
            <SpecTable mobile={mobile} />
          </div>

          {/* Similar Mobiles */}
          {similarMobiles.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-gray-900 dark:text-white">Similar {mobile.brand} Phones</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">{similarMobiles.length} results</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {similarMobiles.map(m => (
                  <MobileCard
                    key={m.id}
                    mobile={m}
                    onCompare={m2 => navigate('/compare', { state: { preselected: m2.id } })}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20">
          <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No detection result found.</p>
          <button onClick={() => navigate('/')} className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition-colors">
            Go Back
          </button>
        </div>
      )}
    </div>
  );
}
