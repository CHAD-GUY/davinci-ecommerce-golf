'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import type { Media } from '@/payload-types'

interface VideoSection {
  title?: string
  description?: string
  video?: Media
  thumbnail?: Media
  videoUrl?: string
  layout: string
  cta?: {
    text?: string
    link?: string
  }
}

interface VideoSliderProps {
  videos: VideoSection[]
}

export function VideoSlider({ videos }: VideoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const nextVideoRef = useRef<HTMLVideoElement>(null)

  // Set video to start at 5 seconds when it loads and handle loading state
  useEffect(() => {
    if (videoRef.current) {
      setIsLoading(true)

      const handleLoadedData = () => {
        if (videoRef.current) {
          videoRef.current.currentTime = 1
          setIsLoading(false)
        }
      }

      const handleCanPlay = () => {
        setIsLoading(false)
      }

      videoRef.current.addEventListener('loadeddata', handleLoadedData)
      videoRef.current.addEventListener('canplay', handleCanPlay)

      // If video is already loaded
      if (videoRef.current.readyState >= 3) {
        videoRef.current.currentTime = 5
        setIsLoading(false)
      }

      return () => {
        videoRef.current?.removeEventListener('loadeddata', handleLoadedData)
        videoRef.current?.removeEventListener('canplay', handleCanPlay)
      }
    }
  }, [currentIndex])

  // Preload next video
  useEffect(() => {
    if (videos.length > 1 && nextVideoRef.current) {
      const nextIndex = (currentIndex + 1) % videos.length
      const nextVideo = videos[nextIndex]
      const nextVideoMedia = nextVideo?.video as Media | undefined

      if (nextVideoMedia?.url) {
        nextVideoRef.current.src = nextVideoMedia.url
        nextVideoRef.current.load()
      }
    }
  }, [currentIndex, videos])

  // Auto-play slider every 10 seconds
  useEffect(() => {
    if (videos.length <= 1) return

    const interval = setInterval(() => {
      handleNext()
    }, 10000)

    return () => clearInterval(interval)
  }, [currentIndex, videos.length])

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % videos.length)
  }

  const handlePrev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length)
  }

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = swipePower(offset.x, velocity.x)

    if (swipe < -swipeConfidenceThreshold) {
      handleNext()
    } else if (swipe > swipeConfidenceThreshold) {
      handlePrev()
    }
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  const currentVideo = videos[currentIndex]
  const videoMedia = currentVideo?.video as Media | undefined
  const thumbnailMedia = currentVideo?.thumbnail as Media | undefined

  // Single video - no slider
  if (videos.length === 1) {
    return (
      <div className="relative w-full overflow-hidden">
        <div className="flex items-center justify-center w-full bg-black" style={{ height: 'calc(100vh - 4rem)' }}>
          {/* Loading spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
          )}

          {currentVideo.videoUrl ? (
            <iframe
              src={currentVideo.videoUrl}
              className="w-full h-full object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : videoMedia?.url ? (
            <video
              ref={videoRef}
              src={videoMedia.url}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover scale-110"
              poster={thumbnailMedia?.url || undefined}
            />
          ) : null}
        </div>
      </div>
    )
  }

  // Multiple videos - with slider
  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative bg-black" style={{ height: 'calc(100vh - 4rem)' }}>
        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
        )}

        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 flex items-center justify-center w-full h-full cursor-grab active:cursor-grabbing"
          >
            {currentVideo.videoUrl ? (
              <iframe
                src={currentVideo.videoUrl}
                className="w-full h-full object-cover"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : videoMedia?.url ? (
              <video
                ref={videoRef}
                src={videoMedia.url}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="w-full h-full object-cover scale-110"
                poster={thumbnailMedia?.url || undefined}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>

        {/* Hidden video for preloading next video */}
        {videos.length > 1 && <video ref={nextVideoRef} className="hidden" preload="auto" muted />}

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
          aria-label="Previous video"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
          aria-label="Next video"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to video ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
