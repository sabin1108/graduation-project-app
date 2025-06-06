"use client"

import { useEffect, useState } from "react"

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return prevProgress + 10
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 to-teal-400">
      <div className="w-24 h-24 mb-8 rounded-2xl overflow-hidden bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
        <span className="text-3xl font-bold text-white">HK</span>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">한경대학교</h1>
      <p className="text-white/90 mb-8 text-center">
        학생 도우미 챗봇
        <br />
        <span className="text-sm">언제 어디서나 필요한 정보를 제공합니다</span>
      </p>

      <div className="w-64 h-2 bg-white/30 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-white/80">로딩 중... {progress}%</p>
    </div>
  )
}
