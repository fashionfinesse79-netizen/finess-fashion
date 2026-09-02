'use client';

import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface CloudinaryUploadProps {
  onUploadSuccess?: (url: string) => void;
  onMultipleUploadSuccess?: (urls: string[]) => void;
  onUploadError?: (error: string) => void;
  currentValue?: string;
  label?: string;
  resourceType?: 'image' | 'video';
  multiple?: boolean;
  showPreview?: boolean;
  className?: string;
}

export function CloudinaryUpload({
  onUploadSuccess,
  onMultipleUploadSuccess,
  onUploadError,
  currentValue,
  label = 'Upload from Device',
  resourceType = 'image',
  multiple = false,
  showPreview = true,
  className = ''
}: CloudinaryUploadProps) {
  const [loading, setLoading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setSuccess(false);
    setLoading(true);
    setUploadCount(files.length);

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset || cloudName.includes('your_cloudinary') || uploadPreset.includes('your_unsigned')) {
        throw new Error(
          'Cloudinary environment variables (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) are not configured. Please set them up in your environment settings.'
        );
      }

      const uploadSingleFile = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        const uploadEndpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
        const res = await fetch(uploadEndpoint, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error?.message || `Failed to upload ${file.name} to Cloudinary.`);
        }

        const data = await res.json();
        return data.secure_url;
      };

      const fileArray = Array.from(files);
      const uploadedUrls = await Promise.all(fileArray.map(uploadSingleFile));

      setSuccess(true);

      if (multiple && onMultipleUploadSuccess) {
        onMultipleUploadSuccess(uploadedUrls);
      }
      if (onUploadSuccess && uploadedUrls.length > 0) {
        onUploadSuccess(uploadedUrls[0]);
      }
    } catch (err: any) {
      console.error('Cloudinary upload error:', err);
      const errMsg = err.message || 'An error occurred during file upload.';
      setError(errMsg);
      if (onUploadError) onUploadError(errMsg);
    } finally {
      setLoading(false);
      setUploadCount(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`mt-1 space-y-2 ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={resourceType === 'video' ? 'video/*' : 'image/*'}
        multiple={multiple}
        className="hidden"
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 border border-[#58111A] text-[#58111A] bg-transparent hover:bg-[#58111A] hover:text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          {loading
            ? multiple && uploadCount > 1
              ? `Uploading ${uploadCount} files...`
              : 'Uploading...'
            : label}
        </button>

        {loading && (
          <span className="text-[11px] text-gray-500 italic animate-pulse">
            {multiple && uploadCount > 1
              ? `Optimizing and uploading ${uploadCount} media assets...`
              : 'Processing and storing file...'}
          </span>
        )}

        {success && !loading && (
          <span className="flex items-center gap-1 text-[11px] text-green-700 font-semibold uppercase tracking-wider">
            <CheckCircle className="w-3.5 h-3.5" /> Uploaded {multiple && uploadCount > 1 ? `(${uploadCount} files)` : ''}
          </span>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-1.5 text-[10px] text-red-700 uppercase tracking-wider font-semibold bg-red-50 border border-red-200 p-2.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {showPreview && currentValue && currentValue.startsWith('http') && (
        <div className="mt-1">
          {resourceType === 'video' ? (
            <div className="relative w-48 border border-[#58111A]/15 bg-black">
              <video
                src={currentValue}
                controls
                className="w-full max-h-36 object-contain"
              />
            </div>
          ) : (
            <div className="relative w-16 h-20 border border-[#58111A]/15 overflow-hidden bg-white">
              <img
                src={currentValue}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
