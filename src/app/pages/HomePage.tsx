import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Smartphone, Zap, Shield, BarChart3, ArrowRight, Search, Star } from 'lucide-react';
import { UploadBox } from '../components/UploadBox';
import { Loader } from '../components/Loader';
import { MobileCard } from '../components/MobileCard';
import { mobilesData } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const BRANDS = ['All', 'Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi'];

export function HomePage() {
  const navigate = useNavigate();
  const { addToHistory } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBrand, setFilterBrand] = useState('All');

  const handleFileSelect = (file: File, url: string) => {
    setSelectedFile(file);
    setPreviewUrl(url);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleDetect = async () => {
    if (!selectedFile) {
      toast.error('Please upload a phone image first.');
      return;
    }
    setIsDetecting(true);
    toast.info('AI is analyzing your image...');

    // Simulate AI processing time (2.5s)
    await new Promise(r => setTimeout(r, 2500));

    // Simulate AI detection: randomly pick a phone
    const randomIndex = Math.floor(Math.random() * mobilesData.length);
    const detected = mobilesData[randomIndex];
    const confidence = +(0.72 + Math.random() * 0.25).toFixed(2); // 0.72 – 0.97

    addToHistory({
      mobileId: detected.id,
      mobileFullName: detected.fullName,
      imageUrl: previewUrl || '',
      detectedBrand: detected.brand,
      detectedModel: detected.model,
      confidence,
    });

    setIsDetecting(false);
    navigate('/results', {
      state: { detectedMobile: detected, confidence, imageUrl: previewUrl, fromUpload: true },
    });
  };

  const filteredMobiles = mobilesData.filter(m => {
    const matchBrand = filterBrand === 'All' || m.brand === filterBrand;
    const matchSearch = !searchQuery || m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || m.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchBrand && matchSearch;
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 dark:from-indigo-900 dark:via-violet-900 dark:to-purple-950">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-violet-500/20 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-indigo-400/10 rounded-full blur-xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 px-4 py-1.5 rounded-full text-sm mb-6 backdrop-blur-sm border border-white/20">
                <Zap className="w-4 h-4 text-amber-400" />
                AI-Powered Recognition
                <span className="bg-amber-400 text-gray-900 text-xs px-1.5 py-0.5 rounded-full">NEW</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
                Identify Any<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-pink-300">
                  Mobile Phone
                </span><br />
                Instantly
              </h1>

              <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                Upload a photo of any smartphone and our AI will detect the brand, model, and display complete specifications — all in seconds.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button
                  onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-700 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
                >
                  <Smartphone className="w-5 h-5" />
                  Detect a Phone
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/compare')}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors border border-white/20 backdrop-blur-sm"
                >
                  <BarChart3 className="w-5 h-5" />
                  Compare Phones
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-6 mt-10 justify-center lg:justify-start">
                {[
                  { val: '14+', label: 'Phones in DB' },
                  { val: '8', label: 'Brands' },
                  { val: '95%', label: 'AI Accuracy' },
                ].map(({ val, label }) => (
                  <div key={label} className="text-center">
                    <p className="text-2xl text-white">{val}</p>
                    <p className="text-xs text-white/60 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Upload Section */}
            <div id="upload-section" className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-white">Upload Phone Image</h3>
              </div>

              <UploadBox
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                previewUrl={previewUrl}
                onClear={handleClear}
              />

              <button
                onClick={handleDetect}
                disabled={!selectedFile || isDetecting}
                className="w-full mt-4 py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-gray-900 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDetecting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-900/20 border-t-gray-900 rounded-full animate-spin" />
                    Detecting...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Detect Mobile
                  </>
                )}
              </button>

              {isDetecting && (
                <div className="mt-3 text-center">
                  <p className="text-white/70 text-sm">Uploading to Cloudinary → Hugging Face AI...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Zap className="w-5 h-5 text-amber-500" />, title: 'Instant Detection', desc: '< 3 second AI analysis' },
              { icon: <Shield className="w-5 h-5 text-green-500" />, title: 'Secure Uploads', desc: 'Cloudinary encrypted storage' },
              { icon: <BarChart3 className="w-5 h-5 text-indigo-500" />, title: 'Full Specs', desc: 'Complete specifications' },
              { icon: <Star className="w-5 h-5 text-violet-500" />, title: 'Smart Compare', desc: 'Side-by-side comparison' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="text-sm text-gray-800 dark:text-gray-100">{title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-gray-900 dark:text-white">Mobile Phone Catalog</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Browse {mobilesData.length} phones across {BRANDS.length - 1} brands</p>
          </div>

          {/* Search + Filter */}
          <div className="flex gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search phones..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 w-48"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {BRANDS.map(brand => (
                <button
                  key={brand}
                  onClick={() => setFilterBrand(brand)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                    filterBrand === brand
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredMobiles.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No phones found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredMobiles.map(mobile => (
              <MobileCard
                key={mobile.id}
                mobile={mobile}
                onCompare={m => navigate('/compare', { state: { preselected: m.id } })}
              />
            ))}
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 dark:text-white">How It Works</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Three simple steps to identify any phone</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: <Smartphone className="w-7 h-7" />, title: 'Upload Image', desc: 'Drag & drop or browse your phone image. Supports JPG, PNG, WebP up to 2MB.' },
              { step: '02', icon: <Zap className="w-7 h-7" />, title: 'AI Detection', desc: 'Our Hugging Face AI model analyzes the image via Cloudinary and detects brand & model with confidence score.' },
              { step: '03', icon: <BarChart3 className="w-7 h-7" />, title: 'Get Specifications', desc: 'View full specs, compare with similar phones, save to favorites, or contact seller via WhatsApp.' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white mx-auto">
                    {icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-400 text-gray-900 text-xs flex items-center justify-center">
                    {step}
                  </span>
                </div>
                <h3 className="text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
