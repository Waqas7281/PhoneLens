import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Wrench, Upload, Zap, Search, AlertCircle, CheckCircle2, Package } from 'lucide-react';
import { UploadBox } from '../components/UploadBox';
import { toast } from 'sonner';

export function SparePartsFinderPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

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
      toast.error('Please upload a mobile phone image first.');
      return;
    }

    setIsDetecting(true);
    toast.info('AI is detecting mobile model...');

    // Simulate AI detection
    await new Promise(r => setTimeout(r, 2500));

    // Simulate detection result
    const mockDetection = {
      brand: 'Samsung',
      model: 'Galaxy S23 Ultra',
      confidence: 0.92
    };

    setIsDetecting(false);
    
    // Navigate to parts results
    navigate('/spare-parts/results', {
      state: {
        detection: mockDetection,
        imageUrl: previewUrl
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <Wrench className="w-5 h-5 text-amber-300" />
              <span className="text-sm">For Repair Shop Owners</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Find Spare Parts
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-pink-300">
                Instantly
              </span>
            </h1>
            
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Upload a mobile phone image and instantly discover available spare parts, 
              prices from multiple suppliers, and installation guides.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 justify-center">
              {[
                { value: '500+', label: 'Parts Available' },
                { value: '50+', label: 'Trusted Suppliers' },
                { value: '100+', label: 'Mobile Models' }
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-3xl font-bold">{value}</p>
                  <p className="text-sm text-white/70">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Mobile Image</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">AI will detect the model and find spare parts</p>
            </div>
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
            className="w-full mt-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDetecting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Detecting Model...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Find Spare Parts
              </>
            )}
          </button>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          How It Works
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              icon: <Upload className="w-8 h-8" />,
              title: 'Upload Image',
              description: 'Take a photo of the mobile phone that needs repair and upload it.'
            },
            {
              step: '2',
              icon: <Zap className="w-8 h-8" />,
              title: 'AI Detection',
              description: 'Our AI identifies the exact brand and model with high accuracy.'
            },
            {
              step: '3',
              icon: <Package className="w-8 h-8" />,
              title: 'Get Parts',
              description: 'View all available spare parts with prices from multiple suppliers.'
            }
          ].map(({ step, icon, title, description }) => (
            <div key={step} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="relative inline-block mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                  {icon}
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-400 text-gray-900 text-sm font-bold flex items-center justify-center">
                  {step}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white dark:bg-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Why Use Our Service?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <CheckCircle2 className="w-6 h-6 text-green-500" />, title: 'Instant Results', desc: 'Get parts info in seconds' },
              { icon: <Search className="w-6 h-6 text-blue-500" />, title: 'Multiple Suppliers', desc: 'Compare prices easily' },
              { icon: <Wrench className="w-6 h-6 text-orange-500" />, title: 'Installation Guides', desc: 'Step-by-step instructions' },
              { icon: <AlertCircle className="w-6 h-6 text-purple-500" />, title: 'Quality Verified', desc: 'Original & OEM parts' }
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                <div className="flex-shrink-0">{icon}</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
