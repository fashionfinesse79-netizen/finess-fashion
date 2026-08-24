'use client';

import React, { useRef, useState, useEffect } from 'react';
import { VideoProduct } from '@/lib/types';
import { getStoredVideos } from '@/lib/store';
import { formatINR } from '@/lib/store';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';

function VideoCard({ video, onPlay }: { video: VideoProduct; onPlay: (video: VideoProduct) => void }) {
  return (
    <div className="video-card-container flex-shrink-0 w-[260px] sm:w-[280px] snap-start">
      <div
        className="relative h-[420px] sm:h-[460px] rounded-2xl overflow-hidden cursor-pointer group shadow-lg border border-[#58111A]/10"
        onClick={() => onPlay(video)}
      >
        {/* Video or Thumbnail Background */}
        {video.videoUrl && !video.videoUrl.includes('youtube.com') && !video.videoUrl.includes('youtu.be') ? (
          <video
            src={video.videoUrl}
            poster={video.thumbnailUrl}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}


        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-2xl group-hover:scale-110 transition-transform duration-300">
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          </div>
        </div>

        {/* Sale Badge */}
        {video.originalPrice > video.salePrice && (
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-[#D4AF37] text-[#58111A] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
            {Math.round(((video.originalPrice - video.salePrice) / video.originalPrice) * 100)}% OFF
          </div>
        )}

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
          <h3 className="font-serif-luxury text-lg text-white leading-tight line-clamp-2 drop-shadow-lg">
            {video.title}
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-[#D4AF37] font-bold text-base">
              {formatINR(video.salePrice)}
            </span>
            {video.originalPrice > video.salePrice && (
              <span className="text-white/50 text-sm line-through">
                {formatINR(video.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VideoCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [videos, setVideos] = useState<VideoProduct[]>([]);
  const [playingVideo, setPlayingVideo] = useState<VideoProduct | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch('/api/videos');
        if (res.ok) {
          const data = await res.json();
          setVideos(data.sort((a: any, b: any) => a.order - b.order));
        } else {
          const stored = getStoredVideos();
          setVideos(stored.sort((a, b) => a.order - b.order));
        }
      } catch (err) {
        const stored = getStoredVideos();
        setVideos(stored.sort((a, b) => a.order - b.order));
      }
    }
    loadVideos();
  }, []);


  const updateScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [videos]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (videos.length === 0) {
    return (
      <section className="bg-[#FAF6F0] py-20 border-y border-[#58111A]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-bold block mb-3">
            VIDEO LOOKBOOK
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#58111A] uppercase mb-4">
            Coming Soon
          </h2>
          <p className="text-sm text-[#7A3B43]">Our exclusive video lookbook is being curated. Check back soon.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="video-carousel-section bg-[#FAF6F0] py-16 sm:py-20 border-y border-[#58111A]/15 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-bold block mb-2">
                VIDEO LOOKBOOK
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-5xl text-[#58111A] uppercase leading-tight">
                Shop The Look
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`w-10 h-10 rounded-full border border-[#58111A]/20 flex items-center justify-center transition-all duration-300 ${
                  canScrollLeft ? 'hover:bg-[#58111A] hover:text-white hover:border-[#58111A] text-[#58111A]' : 'opacity-30 cursor-not-allowed text-gray-400'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`w-10 h-10 rounded-full border border-[#58111A]/20 flex items-center justify-center transition-all duration-300 ${
                  canScrollRight ? 'hover:bg-[#58111A] hover:text-white hover:border-[#58111A] text-[#58111A]' : 'opacity-30 cursor-not-allowed text-gray-400'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Carousel */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory video-carousel-scroll"
          >
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} onPlay={setPlayingVideo} />
            ))}
          </div>
        </div>
      </section>

      {/* Reel Viewer Modal */}
      {playingVideo && (
        <div
          className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPlayingVideo(null)}
          onTouchStart={e => setTouchStartX(e.touches[0].clientX)}
          onTouchEnd={e => {
            if (touchStartX === null) return;
            const deltaX = e.changedTouches[0].clientX - touchStartX;
            const currentIdx = videos.findIndex(v => v.id === playingVideo.id);
            if (deltaX > 50) {
              // swipe right -> previous video
              const prevIdx = (currentIdx - 1 + videos.length) % videos.length;
              setPlayingVideo(videos[prevIdx]);
            } else if (deltaX < -50) {
              // swipe left -> next video
              const nextIdx = (currentIdx + 1) % videos.length;
              setPlayingVideo(videos[nextIdx]);
            }
            setTouchStartX(null);
          }}
        >
          <div className="relative w-full max-w-sm max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setPlayingVideo(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors border border-white/20"
            >
              <X className="w-5 h-5" />
            </button>
            {/* Navigation Arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIdx = videos.findIndex(v => v.id === playingVideo.id);
                const prevIdx = (currentIdx - 1 + videos.length) % videos.length;
                setPlayingVideo(videos[prevIdx]);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIdx = videos.findIndex(v => v.id === playingVideo.id);
                const nextIdx = (currentIdx + 1) % videos.length;
                setPlayingVideo(videos[nextIdx]);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            {/* Video Content */}
            <div className="w-full aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10">
              {playingVideo.videoUrl.includes('youtube.com') || playingVideo.videoUrl.includes('youtu.be') ? (
                <iframe
                  src={playingVideo.videoUrl
                    .replace('watch?v=', 'embed/')
                    .replace('youtu.be/', 'youtube.com/embed/') + '?autoplay=1'}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <video
                  src={playingVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {/* Video Info */}
            <div className="mt-4 text-center">
              <h3 className="font-serif-luxury text-xl text-white mb-1">{playingVideo.title}</h3>
              <div className="flex items-center justify-center gap-3 text-white">
                <span className="text-[#D4AF37] font-bold">{formatINR(playingVideo.salePrice)}</span>
                {playingVideo.originalPrice > playingVideo.salePrice && (
                  <span className="text-white/40 line-through text-sm">
                    {formatINR(playingVideo.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
