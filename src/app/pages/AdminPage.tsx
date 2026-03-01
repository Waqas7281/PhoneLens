import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Plus, Edit2, Trash2, BarChart3, Smartphone, TrendingUp, Users, X, Check, ShieldCheck, Eye } from 'lucide-react';
import { mobilesData as initialData, Mobile, analyticsMock } from '../data/mockData';
import { toast } from 'sonner';

const EMPTY_FORM: Omit<Mobile, 'id'> = {
  brand: '', model: '', fullName: '',
  display: '', ram: '', storage: '', camera: '',
  battery: '', processor: '', os: '', price: 0,
  rating: 4.5, images: [''], releaseYear: new Date().getFullYear(),
  description: '', weight: '', dimensions: '', network: '', colors: [],
};

export function AdminPage() {
  const [mobiles, setMobiles] = useState<Mobile[]>(initialData);
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'analytics'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!form.brand.trim()) e.brand = 'Brand is required';
    if (!form.model.trim()) e.model = 'Model is required';
    if (!form.processor.trim()) e.processor = 'Processor is required';
    if (!form.ram.trim()) e.ram = 'RAM is required';
    if (!form.storage.trim()) e.storage = 'Storage is required';
    if (!form.display.trim()) e.display = 'Display is required';
    if (!form.camera.trim()) e.camera = 'Camera is required';
    if (!form.battery.trim()) e.battery = 'Battery is required';
    if (!form.os.trim()) e.os = 'OS is required';
    if (!form.price || form.price <= 0) e.price = 'Valid price required';
    if (form.rating < 0 || form.rating > 5) e.rating = 'Rating must be 0–5';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleEdit = (mobile: Mobile) => {
    setEditingId(mobile.id);
    setForm({ ...mobile });
    setActiveTab('add');
    setFormErrors({});
  };

  const handleDelete = (id: string) => {
    setMobiles(prev => prev.filter(m => m.id !== id));
    setDeleteConfirm(null);
    toast.success('Mobile deleted successfully');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (editingId) {
      setMobiles(prev => prev.map(m => m.id === editingId ? { ...form, id: editingId } : m));
      toast.success(`${form.brand} ${form.model} updated successfully`);
    } else {
      const newMobile: Mobile = { ...form, id: `m${Date.now()}`, fullName: `${form.brand} ${form.model}` };
      setMobiles(prev => [...prev, newMobile]);
      toast.success(`${form.brand} ${form.model} added successfully`);
    }
    setForm(EMPTY_FORM);
    setEditingId(null);
    setActiveTab('list');
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormErrors({});
    setActiveTab('list');
  };

  const Field = ({ label, field, type = 'text', placeholder = '', required = false }: {
    label: string; field: keyof Omit<Mobile, 'id' | 'colors'>; type?: string; placeholder?: string; required?: boolean;
  }) => (
    <div>
      <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={String(form[field] || '')}
        onChange={e => {
          const val = type === 'number' ? +e.target.value : e.target.value;
          setForm(p => ({ ...p, [field]: val, fullName: field === 'brand' || field === 'model' ? `${field === 'brand' ? e.target.value : p.brand} ${field === 'model' ? e.target.value : p.model}`.trim() : p.fullName }));
          setFormErrors(p => ({ ...p, [field]: '' }));
        }}
        placeholder={placeholder}
        className={`w-full px-3 py-2 text-sm border rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-indigo-400 transition-colors ${formErrors[field] ? 'border-red-400' : 'border-gray-200 dark:border-slate-600'}`}
      />
      {formErrors[field] && <p className="text-xs text-red-500 mt-0.5">{formErrors[field]}</p>}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-6 h-6 text-amber-500" />
            <h1 className="text-gray-900 dark:text-white">Admin Dashboard</h1>
            <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs px-2 py-0.5 rounded-full">Admin</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage mobile database and view analytics</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Mobiles', value: mobiles.length, icon: <Smartphone className="w-5 h-5" />, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' },
          { label: 'Total Searches', value: '1,505', icon: <TrendingUp className="w-5 h-5" />, color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
          { label: 'Active Users', value: '2', icon: <Users className="w-5 h-5" />, color: 'text-violet-500 bg-violet-50 dark:bg-violet-900/20' },
          { label: 'Brands', value: [...new Set(mobiles.map(m => m.brand))].length, icon: <BarChart3 className="w-5 h-5" />, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
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
          { id: 'list', label: 'Mobiles', icon: <Smartphone className="w-4 h-4" /> },
          { id: 'add', label: editingId ? 'Edit Mobile' : 'Add Mobile', icon: <Plus className="w-4 h-4" /> },
          { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
        ].map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id as typeof activeTab); if (id !== 'add') { setEditingId(null); setForm(EMPTY_FORM); } }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === id ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* MOBILES LIST */}
      {activeTab === 'list' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-700">
            <h3 className="text-gray-900 dark:text-white">All Mobiles ({mobiles.length})</h3>
            <button
              onClick={() => { setActiveTab('add'); setEditingId(null); setForm(EMPTY_FORM); }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add New
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-slate-700/50">
                <tr>
                  {['Phone', 'Brand', 'Processor', 'RAM', 'Price', 'Rating', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                {mobiles.map(mobile => (
                  <tr key={mobile.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={mobile.images[0]} alt={mobile.fullName} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        <div>
                          <p className="text-gray-800 dark:text-gray-100 text-sm truncate max-w-36">{mobile.model}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{mobile.releaseYear}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">{mobile.brand}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs max-w-32 truncate">{mobile.processor}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">{mobile.ram}</td>
                    <td className="px-4 py-3 text-indigo-600 dark:text-indigo-400 text-sm">${mobile.price.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400">★</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{mobile.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => window.open(`/results?id=${mobile.id}`, '_blank')}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(mobile)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {deleteConfirm === mobile.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDelete(mobile.id)} className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors" title="Confirm delete">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteConfirm(null)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors" title="Cancel">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(mobile.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD / EDIT FORM */}
      {activeTab === 'add' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 flex items-center justify-between">
            <h3 className="text-gray-900 dark:text-white">{editingId ? '✏️ Edit Mobile' : '➕ Add New Mobile'}</h3>
            <button onClick={handleCancel} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Field label="Brand" field="brand" placeholder="e.g. Apple, Samsung" required />
              <Field label="Model" field="model" placeholder="e.g. iPhone 15 Pro" required />
              <Field label="Processor" field="processor" placeholder="e.g. Apple A17 Pro" required />
              <Field label="RAM" field="ram" placeholder="e.g. 8 GB LPDDR5" required />
              <Field label="Storage" field="storage" placeholder="e.g. 256 GB / 512 GB" required />
              <div className="sm:col-span-2 lg:col-span-1">
                <Field label="Display" field="display" placeholder='e.g. 6.7" OLED 120Hz' required />
              </div>
              <div className="sm:col-span-2">
                <Field label="Camera" field="camera" placeholder="e.g. 50 MP Main + 12 MP Ultra-Wide" required />
              </div>
              <div className="sm:col-span-2">
                <Field label="Battery" field="battery" placeholder="e.g. 4422 mAh, 27W Fast Charge" required />
              </div>
              <Field label="Operating System" field="os" placeholder="e.g. iOS 17 / Android 14" required />
              <Field label="Connectivity" field="network" placeholder="e.g. 5G, Wi-Fi 6E, BT 5.3" />
              <Field label="Price (USD)" field="price" type="number" placeholder="999" required />
              <Field label="Rating (0-5)" field="rating" type="number" placeholder="4.5" required />
              <Field label="Release Year" field="releaseYear" type="number" placeholder="2024" />
              <Field label="Weight" field="weight" placeholder="e.g. 206 g" />
              <Field label="Dimensions" field="dimensions" placeholder="e.g. 147.5 × 71.5 × 7.85 mm" />
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">Image URL</label>
                <input
                  type="url"
                  value={form.images[0] || ''}
                  onChange={e => setForm(p => ({ ...p, images: [e.target.value] }))}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-indigo-400"
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Brief description of the phone..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-indigo-400 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100 dark:border-slate-700">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm transition-colors shadow-sm flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {editingId ? 'Save Changes' : 'Add Mobile'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Brand Searches Bar Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
              <h3 className="text-gray-900 dark:text-white mb-5">Searches by Brand</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={analyticsMock.brandSearches} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="brand" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9', fontSize: '12px' }}
                  />
                  <Bar dataKey="searches" fill="url(#brandGrad)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="brandGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Searches Line Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
              <h3 className="text-gray-900 dark:text-white mb-5">Monthly Search Trend</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={analyticsMock.monthlySearches}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="searches" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Popular Models */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
            <h3 className="text-gray-900 dark:text-white mb-5">🔥 Most Searched Models</h3>
            <div className="space-y-3">
              {analyticsMock.popularModels.map(({ model, count }, idx) => {
                const maxCount = analyticsMock.popularModels[0].count;
                return (
                  <div key={model} className="flex items-center gap-4">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                      idx === 0 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                      idx === 1 ? 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400' :
                      idx === 2 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                      'bg-gray-50 dark:bg-slate-700/50 text-gray-500 dark:text-gray-400'
                    }`}>{idx + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-800 dark:text-gray-200">{model}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{count} searches</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all"
                          style={{ width: `${(count / maxCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
