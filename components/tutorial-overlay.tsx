"use client"

import { useState, useEffect } from "react"
import { ChevronRight, ChevronLeft, X } from "lucide-react"

interface TutorialStep {
  id: string
  title: string
  description: string
  image?: string
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "guide1",
    title: "장학공지 가이드",
    description: "[원하는달] 장학공지 하면 그달에 공지가 나옵니다<br />예: 10월 장학공지.",
    image: "/guide1.png",
  },
  {
    id: "guide2",
    title: "한경공지 가이드",
    description: "[원하는달] 한경공지 하면 그달에 공지가 나옵니다<br />예: 10월 한경공지.",
    image: "/guide2.png",
  },
  {
    id: "guide3",
    title: "학사공지 가이드",
    description: "[원하는달] 학사공지 하면 그달에 공지가 나옵니다<br />예: 10월 학사공지.",
    image: "/guide3.png",
  },
  {
    id: "guide4",
    title: "교직원 식당 가이드",
    description: "[원하는 날짜] 교직원식당 하면 그 날짜의 식단이 나옵니다<br />예: 11월 05일 교직원식당.",
    image: "/guide4.png",
  },
  {
    id: "guide5",
    title: "기숙사 식당 가이드",
    description: "[원하는 날짜] 기숙사식당 하면 그 날짜의 식단이 나옵니다<br />예: 11월 05일 기숙사식당.",
    image: "/guide5.png",
  },
  {
    id: "guide6",
    title: "학생 식당 가이드",
    description: "[원하는 날짜] 학생식당 하면 그 날짜의 식단이 나옵니다<br />예: 11월 05일 학생식당.",
    image: "/guide6.png",
  },
]

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TutorialOverlay({ isOpen, onClose }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0)

  if (!isOpen) return null

  const step = TUTORIAL_STEPS[currentStep]
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div
        className="fixed z-50 bg-white rounded-lg shadow-2xl p-6 w-[90vw] md:w-[80vw] max-w-3xl max-h-[90vh] md:max-h-[80vh] overflow-y-auto"
        style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
        }}
      >
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-blue-600">
            단계 {currentStep + 1} / {TUTORIAL_STEPS.length}
          </span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="튜토리얼 닫기"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Title and description */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
        <p className="text-gray-600 text-sm mb-6" dangerouslySetInnerHTML={{ __html: step.description }}></p>

        {step.image && ( // Conditionally render image
          <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
            <img src={step.image} alt={step.title} className="w-full h-auto object-cover" />
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 justify-end">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              이전
            </button>
          )}
          <button
            onClick={() => {
              if (isLastStep) {
                onClose()
              } else {
                setCurrentStep(currentStep + 1)
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
          >
            {isLastStep ? "완료" : "다음"}
            {!isLastStep && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 mt-4 justify-center">
          {TUTORIAL_STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep ? "bg-blue-600 w-6" : "bg-gray-300 w-2"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  )
}
