'use client';

import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';

interface CloudinaryUploadProps {
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: string) => void;
  currentValue?: string;
  label?: string;
}

export function CloudinaryUpload({
  onUploadSuccess,
  onUploadError,
  currentValue,
  label = 'Upload from Device'
}: CloudinaryUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset || cloudName.includes('your_cloudinary') || uploadPreset.includes('your_unsigned')) {
        throw new Error(
          'Cloudinary environment variables (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) are not configured. Please set them up in your environment settings.'
        );
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error?.message || 'Failed to upload to Cloudinary.');
      }

      const data = await res.json();
      setSuccess(true);
      onUploadSuccess(data.secure_url);
    } catch (err: any) {
      console.error('Cloudinary upload error:', err);
      const errMsg = err.message || 'An error occurred during file upload.';
      setError(errMsg);
      if (onUploadError) onUploadError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-1 space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 border border-[#58111A] text-[#58111A] bg-transparent hover:bg-[#58111A] hover:text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          {loading ? 'Uploading...' : label}
        </button>
        
        {loading && (
          <span className="text-[11px] text-gray-500 italic animate-pulse">
            Processing and storing image...
          </span>
        )}

        {success && !loading && (
          <span className="flex items-center gap-1 text-[11px] text-green-700 font-semibold uppercase tracking-wider">
            <CheckCircle className="w-3.5 h-3.5" /> Uploaded
          </span>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-1.5 text-[10px] text-red-700 uppercase tracking-wider font-semibold bg-red-50 border border-red-200 p-2.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {currentValue && currentValue.startsWith('http') && (
        <div className="relative w-16 h-20 border border-[#58111A]/15 overflow-hidden bg-white mt-1">
          <img
            src={currentValue}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
