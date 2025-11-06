"use client"

import { useEffect, useState } from "react"
import { Bot, Sparkles } from "lucide-react"

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      <div className="mb-8 flex justify-center">
        <div className="relative">
          {/* Outer glow layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-2xl scale-110"></div>

          {/* Main badge container with 3D effect */}
          <div className="relative w-32 h-32">
            {/* Shadow layers for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full translate-y-2 opacity-40 blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full translate-y-1 opacity-60"></div>

            {/* Main badge */}
            <div className="relative w-full h-full bg-gradient-to-br from-primary via-primary to-secondary rounded-full flex items-center justify-center border-4 border-background shadow-2xl">
              {/* Inner circle for depth */}
              <div className="absolute inset-3 bg-gradient-to-br from-primary-foreground/10 to-transparent rounded-full"></div>

              {/* Bot Icon */}
              <Bot className="relative w-16 h-16 text-primary-foreground drop-shadow-lg" strokeWidth={1.5} />

              {/* Shine effect */}
              <div className="absolute top-4 left-4 w-12 h-12 bg-white/20 rounded-full blur-xl"></div>
            </div>

<<<<<<< HEAD
            
=======
            {/* Sparkle badge */}
            <div className="absolute -top-1 -right-1 w-10 h-10 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center shadow-xl border-2 border-background">
              <Sparkles className="w-5 h-5 text-secondary-foreground" />
            </div>
>>>>>>> 7105a6c75fde40d7f4332a2f059d31dd2b497598
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-foreground mb-2">한경국립대학교</h1>
      <p className="text-muted-foreground mb-8 text-center">
        학생 도우미 챗봇
        <br />
        <span className="text-sm">언제 어디서나 필요한 정보를 제공합니다</span>
      </p>

      <div className="w-64 h-2 bg-muted rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-muted-foreground">로딩 중... {progress}%</p>
    </div>
  )
}
