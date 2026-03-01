import React, { useState, useRef, useCallback } from 'react';
import { Upload, ImageIcon, X, AlertCircle } from 'lucide-react';

interface UploadBoxProps {
  onFileSelect: (file: File, previewUrl: string) => void;
  selectedFile: File | null;
  previewUrl: string | null;
  onClear: () => void;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 2;

export function UploadBox({ onFileSelect, selectedFile, previewUrl, onClear }: UploadBoxProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = useCallback((file: File) => {
    setError(null);
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only JPG, PNG, and WebP images are allowed.');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File size must be less than ${MAX_SIZE_MB}MB.`);
      return;
    }
    const url = URL.createObjectURL(file);
    onFileSelect(file, url);
  }, [onFileSelect]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSelect(file);
  }, [validateAndSelect]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSelect(file);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(null);
    onClear();
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full">
      {previewUrl ? (
        // Preview State
        <div className="relative rounded-2xl overflow-hidden border-2 border-indigo-300 dark:border-indigo-700 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-64 sm:h-80 object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="bg-white/90 dark:bg-slate-800/90 rounded-lg px-3 py-1.5 flex items-center gap-2 backdrop-blur-sm">
              <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs text-gray-700 dark:text-gray-200 truncate max-w-40">
                {selectedFile?.name}
              </span>
            </div>
            <button
              onClick={handleClear}
              className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-md"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        // Drop Zone
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragEnter={() => setDragging(true)}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          role="button"
          aria-label="Upload phone image"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
          className={`relative w-full h-64 sm:h-80 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-4 ${
            dragging
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 scale-[0.99]'
              : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20'
          }`}
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
            dragging ? 'bg-indigo-500 text-white' : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
          }`}>
            <Upload className="w-7 h-7" />
          </div>
          <div className="text-center px-6">
            <p className="text-gray-700 dark:text-gray-200">
              {dragging ? 'Drop your image here' : (
                <>Drop image here, or <span className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2">browse</span></>
              )}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              JPG, PNG, WebP • Max {MAX_SIZE_MB}MB
            </p>
          </div>

          {/* Decorative corners */}
          {!dragging && (
            <>
              <span className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-indigo-300 dark:border-indigo-700 rounded-tl-lg" />
              <span className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-indigo-300 dark:border-indigo-700 rounded-tr-lg" />
              <span className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-indigo-300 dark:border-indigo-700 rounded-bl-lg" />
              <span className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-indigo-300 dark:border-indigo-700 rounded-br-lg" />
            </>
          )}
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={onInputChange}
        className="hidden"
        aria-label="File input"
      />
    </div>
  );
}
