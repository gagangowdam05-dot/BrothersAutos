'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

interface PhotoGalleryProps {
  images: string[];
  carTitle: string;
  status: string;
}

export default function PhotoGallery({ images, carTitle, status }: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const safeImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
  ];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image Viewer */}
      <div 
        onClick={() => setLightboxOpen(true)}
        className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-md group cursor-pointer"
      >
        <img
          src={safeImages[currentIndex]}
          alt={`${carTitle} - Photo ${currentIndex + 1}`}
          className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-102"
        />

        {/* Gradient shadow for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* Status Badge overlay */}
        {status !== 'AVAILABLE' && (
          <div className="absolute top-4 left-4 z-10">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg ${
              status === 'RESERVED' ? 'bg-amber-500' : 'bg-slate-700'
            }`}>
              {status === 'RESERVED' ? 'Currently Reserved' : 'Sold Vehicle'}
            </span>
          </div>
        )}

        {/* Image Counter & Fullscreen trigger */}
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
            {currentIndex + 1} / {safeImages.length}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(true);
            }}
            className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors border border-white/20"
            title="Expand Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Prev / Next Arrows */}
        {safeImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/20"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/20"
              aria-label="Next Image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all ${
                currentIndex === idx
                  ? 'border-brand-600 ring-2 ring-brand-500/30 scale-102'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl max-h-[80vh] w-full flex items-center justify-center">
            <img
              src={safeImages[currentIndex]}
              alt={`${carTitle} Fullscreen`}
              className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
            />

            {safeImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 sm:-left-12 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 sm:-right-12 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          <div className="mt-4 text-white text-sm font-medium">
            {currentIndex + 1} of {safeImages.length} &bull; {carTitle}
          </div>
        </div>
      )}
    </div>
  );
}
