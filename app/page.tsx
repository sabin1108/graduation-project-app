"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import LoadingScreen from "@/components/loading-screen"
import ChatInterface from "@/components/chat-interface"

export default function Home() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // 로딩 화면을 2초 동안 표시
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return <ChatInterface />
}
