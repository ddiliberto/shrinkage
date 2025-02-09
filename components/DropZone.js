"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';

const MAX_FREE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ACCEPTED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp']
};

export default function DropZone() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [compressing, setCompressing] = useState(false);
  const workerRef = useRef(null);

  useEffect(() => {
    // Initialize worker
    workerRef.current = new Worker('/workers/compression-worker.js');
    
    // Set up message handler
    workerRef.current.onmessage = (e) => {
      const { type, id, status, result, originalSize, compressedSize, error } = e.data;
      
      if (type === 'status') {
        setFiles(prev => prev.map(file => 
          file.id === id ? { ...file, status: status } : file
        ));
      } else if (type === 'success') {
        setFiles(prev => prev.map(file => 
          file.id === id ? {
            ...file,
            status: 'done',
            compressed: URL.createObjectURL(result),
            originalSize,
            compressedSize,
            savings: ((originalSize - compressedSize) / originalSize * 100).toFixed(1)
          } : file
        ));
        setCompressing(false);
      } else if (type === 'error') {
        setFiles(prev => prev.map(file => 
          file.id === id ? { ...file, status: 'error', error } : file
        ));
        setCompressing(false);
      }
    };

    return () => {
      // Clean up worker on unmount
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const compressImage = useCallback((file) => {
    if (!workerRef.current) return;

    const id = Math.random().toString(36).substr(2, 9);
    workerRef.current.postMessage({ file, id });
    return id;
  }, []);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(file => {
        if (file.size > MAX_FREE_SIZE) {
          return `${file.file.name} exceeds 5MB limit for free tier`;
        }
        return `${file.file.name} is not a supported image format`;
      });
      setError(errors.join('\n'));
      return;
    }

    // Check if we've hit the free tier limit
    if (files.length + acceptedFiles.length > 20) {
      setError('Free tier limited to 20 images per session. Please upgrade to Pro for unlimited processing.');
      return;
    }

    setError(null);
    const newFiles = acceptedFiles.map(file => {
      const id = Math.random().toString(36).substr(2, 9);
      return {
        id,
        file,
        preview: URL.createObjectURL(file),
        status: 'pending',
        name: file.name,
        type: file.type,
        size: file.size
      };
    });

    setFiles(prev => [...prev, ...newFiles]);
    setCompressing(true);

    // Start compression for each file
    newFiles.forEach(file => {
      compressImage(file.file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FREE_SIZE,
    multiple: true
  });

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-base-200' : 'border-base-300 hover:border-primary'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 opacity-50"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>
            {isDragActive ? (
              <p className="text-lg">Drop your images here...</p>
            ) : (
              <div className="space-y-2">
                <p className="text-lg">Drag & drop your images here, or click to select</p>
                <p className="text-sm opacity-60">
                  Supports JPG, PNG, GIF, and WebP (up to 5MB per file for free tier)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-error/10 text-error rounded-lg">
          <pre className="whitespace-pre-wrap text-sm">{error}</pre>
        </div>
      )}

      {compressing && (
        <div className="mt-4 text-center">
          <div className="loading loading-spinner loading-md"></div>
          <p className="mt-2 text-sm opacity-70">Compressing your images...</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Images ({files.length}/20)</h3>
            <div className="flex gap-2">
              {files.some(f => f.status === 'done') && (
                <button
                  onClick={() => {
                    // Download all compressed images
                    files.forEach(file => {
                      if (file.status === 'done' && file.compressed) {
                        const link = document.createElement('a');
                        link.href = file.compressed;
                        link.download = `compressed-${file.name}`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }
                    });
                  }}
                  className="btn btn-primary btn-sm"
                >
                  Download All
                </button>
              )}
              <button
                onClick={() => {
                  // Clear all files
                  files.forEach(file => {
                    if (file.preview) URL.revokeObjectURL(file.preview);
                    if (file.compressed) URL.revokeObjectURL(file.compressed);
                  });
                  setFiles([]);
                  setError(null);
                }}
                className="btn btn-ghost btn-sm"
              >
                Clear All
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {files.map((file) => (
              <div key={file.id} className="relative aspect-square rounded-lg overflow-hidden bg-base-200 group">
                <img
                  src={file.preview}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <div className="truncate mb-1 font-medium">{file.name}</div>
                    <div className="text-sm opacity-90">
                      Original: {(file.size / 1024).toFixed(1)}KB
                    </div>
                    {file.status === 'pending' && (
                      <div className="text-blue-300 text-sm">Waiting...</div>
                    )}
                    {file.status === 'processing' && (
                      <div className="text-blue-300 text-sm">Processing...</div>
                    )}
                    {file.status === 'done' && (
                      <>
                        <div className="text-green-300 text-sm">
                          Compressed: {(file.compressedSize / 1024).toFixed(1)}KB
                        </div>
                        <div className="text-green-300 text-sm">
                          Saved {file.savings}%
                        </div>
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = file.compressed;
                            link.download = `compressed-${file.name}`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="mt-2 btn btn-xs btn-primary"
                        >
                          Download
                        </button>
                      </>
                    )}
                    {file.status === 'error' && (
                      <div className="text-red-300 text-sm">{file.error}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
