"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

type CarouselImage = {
  src: string
  alt: string
  title: string
  link?: string
}

type ImageCarouselProps = {
  images: CarouselImage[]
  height?: string
  autoPlay?: boolean
  autoPlayInterval?: number
}

export default function ImageCarousel({
  images,
  height = "h-64",
  autoPlay = true,
  autoPlayInterval = 5000,
  onImageClick,
}: ImageCarouselProps & { onImageClick?: (src: string, link?: string) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // 안정성 확보를 위한 길이 저장
  const imageCount = images.length

  useEffect(() => {
    if (!autoPlay || imageCount === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageCount)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, imageCount]) // ✅ 고정된 개수/순서 유지

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + imageCount) % imageCount)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageCount)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (imageCount === 0) {
    return (
      <div className={`${height} bg-gray-200 rounded-lg flex items-center justify-center`}>
        <p className="text-gray-500">이미지가 없습니다</p>
      </div>
    )
  }

  return (
    <div className={`relative ${height} rounded-lg overflow-hidden shadow-md group`}>
      {/* 이미지 */}
      <div
        className="relative w-full h-full cursor-pointer"
        onClick={() => onImageClick && onImageClick(images[currentIndex].src, images[currentIndex].link)}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out"
          style={{ backgroundImage: `url(${images[currentIndex].src})` }}
        />

        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* 제목 */}
        <div className="absolute bottom-4 left-4 right-4">
          <h4 className="text-white font-medium text-sm drop-shadow-lg">{images[currentIndex].title}</h4>
        </div>
      </div>

      {/* 이전/다음 버튼 */}
      {imageCount > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="이전 이미지"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="다음 이미지"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* 인디케이터 */}
      {imageCount > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`${index + 1}번째 이미지로 이동`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
