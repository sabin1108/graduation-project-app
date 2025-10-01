"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
// import { useChat } from "ai/react" // 이 줄은 제거됩니다.
import {
  Send,
  Settings,
  Download,
  Trash2,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Copy,
  Languages,
  Bot,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import Sidebar from "./sidebar"
import CalendarModal from "./calendar-modal"

const quickReplies = [
  "수강 신청은 어떻게 하나요?",
  "장학금 신청 기간은 언제인가요?",
  "기숙사 신청 방법이 궁금합니다.",
  "도서관 이용시간을 알려주세요",
  "학사일정을 확인하고 싶어요",
]

export default function EnhancedChatInterface() {
  const [messages, setMessages] = useState<{ id: string; role: "user" | "assistant"; content: string }[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fontSize, setFontSize] = useState(14)
  const [autoScroll, setAutoScroll] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showTimestamp, setShowTimestamp] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()
  const [userId, setUserId] = useState("")

  useEffect(() => {
    setUserId(uuidv4())
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>, messageContent?: string) => {
    if (e) e.preventDefault()
    const currentMessage = messageContent || input.trim()
    if (!currentMessage) return

    const userMessage = { id: Date.now().toString(), role: "user" as const, content: currentMessage }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInput("")

    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentMessage, userId: userId }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const assistantMessage = {
        id: Date.now().toString() + "-bot",
        role: "assistant" as const,
        content: data.answer || "응답이 없습니다.",
      }
      setMessages((prevMessages) => [...prevMessages, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString() + "-error", role: "assistant", content: "메시지 전송 중 오류가 발생했습니다." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickReply = (reply: string) => {
    handleSubmit(undefined, reply)
  }

  const handleMenuClick = (menu: string) => {
    const mealMenus = ["학생식당", "기숙사식당", "교직원식당"]
    if (mealMenus.includes(menu)) {
      const question = `오늘 ${menu}`
      handleSubmit(undefined, question)
    }
  }
  const exportChat = () => {
    const chatContent = messages
      .map((msg) => `${msg.role === "user" ? "사용자" : "한경대 챗봇"}: ${msg.content}`)
      .join("\n\n")

    const blob = new Blob([chatContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `한경대_챗봇_대화_${new Date().toLocaleDateString()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearChat = () => {
    if (confirm("모든 대화를 삭제하시겠습니까?")) {
      // 채팅 초기화 로직
      window.location.reload()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    // 토스트 알림 등 추가 가능
  }

  const speakMessage = (content: string) => {
    if (soundEnabled && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(content)
      utterance.lang = "ko-KR"
      speechSynthesis.speak(utterance)
    }
  }

  const translateMessage = (content: string) => {
    // 번역 기능 구현 (Google Translate API 등)
    console.log("번역:", content)
  }

  useEffect(() => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, autoScroll])

  return (
    <div className={`flex h-screen bg-background ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
      {!isFullscreen && (
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          onCalendarClick={() => setShowCalendar(true)}
          onMenuClick={handleMenuClick}
        />
      )}

      <div className="flex-1 flex flex-col h-full">
        {/* Enhanced Header */}
        <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm">
          <div className="flex items-center">
            {!isFullscreen && (
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="mr-4 md:hidden p-1 rounded-md hover:bg-accent"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}

            <div className="flex items-center">
              <div className="relative w-10 h-10 mr-3">
                {/* Shadow layers for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full translate-y-1 opacity-40 blur-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full translate-y-0.5 opacity-60"></div>

                {/* Main badge */}
                <div className="relative w-full h-full bg-gradient-to-br from-primary via-primary to-secondary rounded-full flex items-center justify-center border-2 border-background shadow-lg">
                  {/* Inner circle for depth */}
                  <div className="absolute inset-1 bg-gradient-to-br from-primary-foreground/10 to-transparent rounded-full"></div>

                  {/* Bot Icon */}
                  <Bot className="relative w-5 h-5 text-primary-foreground drop-shadow-md" strokeWidth={1.5} />

                  {/* Shine effect */}
                  <div className="absolute top-1.5 left-1.5 w-4 h-4 bg-white/20 rounded-full blur-lg"></div>
                </div>

                {/* Sparkle badge */}
                <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center shadow-md border border-background">
                  <Sparkles className="w-2 h-2 text-secondary-foreground" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-semibold">한경국립대학교 AI 챗봇</h1>
                <p className="text-xs text-muted-foreground">스마트한 학생 도우미</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Chat Controls */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>채팅 설정</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Font Size */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">폰트 크기</span>
                    <span className="text-xs text-muted-foreground">{fontSize}px</span>
                  </div>
                  <Slider
                    value={[fontSize]}
                    onValueChange={(value) => setFontSize(value[0])}
                    max={20}
                    min={12}
                    step={1}
                    className="w-full"
                  />
                </div>

                <DropdownMenuSeparator />

                {/* Toggles */}
                <div className="p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">자동 스크롤</span>
                    <Switch checked={autoScroll} onCheckedChange={setAutoScroll} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">음성 알림</span>
                    <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">시간 표시</span>
                    <Switch checked={showTimestamp} onCheckedChange={setShowTimestamp} />
                  </div>
                </div>

                <DropdownMenuSeparator />

                {/* Actions */}
                <DropdownMenuItem onClick={exportChat}>
                  <Download className="w-4 h-4 mr-2" />
                  대화 내보내기
                </DropdownMenuItem>
                <DropdownMenuItem onClick={clearChat} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  대화 삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Fullscreen Toggle */}
            <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ fontSize: `${fontSize}px` }}>
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} group`}>
              {message.role === "assistant" && (
                <div className="relative w-8 h-8 mr-2">
                  {/* Shadow layers for depth */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full translate-y-0.5 opacity-40 blur-sm"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full translate-y-px opacity-60"></div>

                  {/* Main badge */}
                  <div className="relative w-full h-full bg-gradient-to-br from-primary via-primary to-secondary rounded-full flex items-center justify-center border border-background shadow-md">
                    {/* Inner circle for depth */}
                    <div className="absolute inset-px bg-gradient-to-br from-primary-foreground/10 to-transparent rounded-full"></div>

                    {/* Bot Icon */}
                    <Bot className="relative w-4 h-4 text-primary-foreground" strokeWidth={1.5} />

                    {/* Shine effect */}
                    <div className="absolute top-1 left-1 w-3 h-3 bg-white/20 rounded-full blur-md"></div>
                  </div>

                  {/* Sparkle badge */}
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center shadow-lg border border-background">
                    <Sparkles className="w-2 h-2 text-secondary-foreground" />
                  </div>
                </div>
              )}

              <div className="max-w-[80%] relative">
                <div
                  className={`p-3 rounded-2xl shadow-sm ${
                    message.role === "user"
                      ? "bg-slate-700 text-slate-100"
                      : "bg-card border"
                  }`}
                >
                  <div className="whitespace-pre-line">{message.content}</div>
                </div>

                {/* Message Actions */}
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyMessage(message.content)}
                    className="h-6 w-6 p-0 bg-background border shadow-sm"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>

                  {message.role === "assistant" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakMessage(message.content)}
                        className="h-6 w-6 p-0 bg-background border shadow-sm"
                      >
                        {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => translateMessage(message.content)}
                        className="h-6 w-6 p-0 bg-background border shadow-sm"
                      >
                        <Languages className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </div>

                {showTimestamp && (
                  <div
                    className={`text-xs text-muted-foreground mt-1 ${
                      message.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                )}
              </div>

              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center ml-2 shadow-sm text-sm font-medium">
                  나
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="relative w-8 h-8 mr-2">
                {/* Shadow layers for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full translate-y-0.5 opacity-40 blur-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full translate-y-px opacity-60"></div>

                {/* Main badge */}
                <div className="relative w-full h-full bg-gradient-to-br from-primary via-primary to-secondary rounded-full flex items-center justify-center border border-background shadow-md">
                  {/* Inner circle for depth */}
                  <div className="absolute inset-px bg-gradient-to-br from-primary-foreground/10 to-transparent rounded-full"></div>

                  {/* Bot Icon */}
                  <Bot className="relative w-4 h-4 text-primary-foreground" strokeWidth={1.5} />

                  {/* Shine effect */}
                  <div className="absolute top-1 left-1 w-3 h-3 bg-white/20 rounded-full blur-md"></div>
                </div>

                {/* Sparkle badge */}
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center shadow-lg border border-background">
                  <Sparkles className="w-2 h-2 text-secondary-foreground" />
                </div>
              </div>
              <div className="bg-card border p-3 rounded-2xl">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="p-3 bg-slate-100 border-t">
          <div className="flex flex-wrap gap-2 justify-center">
            {quickReplies.map((reply, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-accent transition-colors px-3 py-1"
                onClick={() => handleQuickReply(reply)}
              >
                {reply}
              </Badge>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-card border-t">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="메시지를 입력하세요..."
              className="flex-1"
              disabled={isLoading}
            />

            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Calendar Modal */}
      <CalendarModal open={showCalendar} onOpenChange={setShowCalendar} />
    </div>
  )
}
