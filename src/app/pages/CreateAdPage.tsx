import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Upload, X, Camera, DollarSign, MapPin, Phone, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function CreateAdPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    price: '',
    originalPrice: '',
    condition: 'Good',
    ram: '',
    storage: '',
    color: '',
    purchaseDate: '',
    batteryHealth: '100',
    screenCondition: 'Perfect',
    description: '',
    city: 'Lahore',
    area: '',
    phone: '',
    whatsapp: '',
    negotiable: true,
    accessories: [] as string[]
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      if (images.length + newImages.length > 10) {
        toast.error('Maximum 10 images allowed');
        return;
      }
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (images.length < 3) {
      toast.error('Please upload at least 3 images');
      return;
    }
    if (!formData.brand || !formData.model || !formData.price) {
      toast.error('Please fill all required fields');
      return;
    }
    
    toast.success('Ad published successfully!');
    setTimeout(() => {
      navigate('/marketplace');
    }, 1500);
  };

  const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];
  const screenConditions = ['Perfect', 'Minor Scratches', 'Scratched', 'Cracked'];
  const cities = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan'];
  const accessoryOptions = ['Box', 'Charger', 'Earphones', 'Case', 'Screen Protector', 'Warranty Card'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sell Your Mobile</h1>
          <p className="text-gray-600 dark:text-gray-400">Create your ad in just a few steps</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Images' },
              { num: 2, label: 'Details' },
              { num: 3, label: 'Condition' },
              { num: 4, label: 'Contact' }
            ].map(({ num, label }, idx) => (
              <React.Fragment key={num}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${
                    step >= num 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 dark:bg-slate-700 text-gray-500'
                  }`}>
                    {step > num ? <Check className="w-5 h-5" /> : num}
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
                </div>
                {idx < 3 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    step > num ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-slate-700'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          {/* Step 1: Images */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upload Images</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Add 3-10 clear photos of your mobile</p>
              
              {/* Image Grid */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 dark:border-slate-600">
                    <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <div className="absolute top-2 left-2 bg-indigo-600 text-white px-2 py-1 rounded text-xs font-medium">
                        Main
                      </div>
                    )}
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {/* Upload Button */}
                {images.length < 10 && (
                  <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-500 flex flex-col items-center justify-center cursor-pointer transition-colors">
                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Add Photo</span>
                    <span className="text-xs text-gray-400">{images.length}/10</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {images.length < 3 && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-700 dark:text-amber-300">Please upload at least 3 images to continue</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Mobile Details</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Brand *</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    placeholder="e.g., Apple, Samsung"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Model *</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    placeholder="e.g., iPhone 15 Pro"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">RAM</label>
                  <input
                    type="text"
                    value={formData.ram}
                    onChange={(e) => setFormData({...formData, ram: e.target.value})}
                    placeholder="e.g., 8 GB"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Storage</label>
                  <input
                    type="text"
                    value={formData.storage}
                    onChange={(e) => setFormData({...formData, storage: e.target.value})}
                    placeholder="e.g., 256 GB"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    placeholder="e.g., Space Black"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Purchase Date</label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe your mobile (condition, usage, any issues...)"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Condition & Price */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Condition & Pricing</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Overall Condition *</label>
                  <div className="grid grid-cols-4 gap-2">
                    {conditions.map((cond) => (
                      <button
                        key={cond}
                        onClick={() => setFormData({...formData, condition: cond})}
                        className={`py-2 rounded-lg font-medium transition-colors ${
                          formData.condition === cond
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                        }`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Battery Health: {formData.batteryHealth}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={formData.batteryHealth}
                    onChange={(e) => setFormData({...formData, batteryHealth: e.target.value})}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Screen Condition</label>
                  <select
                    value={formData.screenCondition}
                    onChange={(e) => setFormData({...formData, screenCondition: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    {screenConditions.map(sc => (
                      <option key={sc} value={sc}>{sc}</option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Price (PKR) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="e.g., 150000"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original Price (optional)</label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                      placeholder="e.g., 200000"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.negotiable}
                      onChange={(e) => setFormData({...formData, negotiable: e.target.checked})}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Price is negotiable</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Accessories Included</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {accessoryOptions.map((acc) => (
                      <label key={acc} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.accessories.includes(acc)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({...formData, accessories: [...formData.accessories, acc]});
                            } else {
                              setFormData({...formData, accessories: formData.accessories.filter(a => a !== acc)});
                            }
                          }}
                          className="w-4 h-4 text-indigo-600"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{acc}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Contact */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact & Location</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Area/Locality *</label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                    placeholder="e.g., DHA Phase 5"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+92 300 1234567"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    placeholder="+92 300 1234567"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Preview Your Ad</h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p><strong>Mobile:</strong> {formData.brand} {formData.model}</p>
                  <p><strong>Price:</strong> PKR {formData.price}</p>
                  <p><strong>Condition:</strong> {formData.condition}</p>
                  <p><strong>Location:</strong> {formData.area}, {formData.city}</p>
                  <p><strong>Images:</strong> {images.length} uploaded</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
              >
                Back
              </button>
            )}
            
            {step < 4 ? (
              <button
                onClick={() => {
                  if (step === 1 && images.length < 3) {
                    toast.error('Please upload at least 3 images');
                    return;
                  }
                  setStep(step + 1);
                }}
                className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Publish Ad
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
