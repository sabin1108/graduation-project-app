"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, Smile } from "lucide-react"
import Sidebar from "./sidebar"
import { Button } from "@/components/ui/button"
import { getMenuForToday } from "@/app/actions/get-menu"
import { getNotice } from "@/app/actions/get-notice"
import { getMenuForCategory } from "@/app/actions/get-notice"

type Message = {
  id: number
  sender: "user" | "bot"
  text: string
  isLoading?: boolean
  timestamp?: string
}

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "bot",
    text: "안녕하세요! 한경대학교 챗봇 도우미입니다. 무엇을 도와드릴까요?",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  },
]

const quickReplies = [
  "수강 신청은 어떻게 하나요?",
  "장학금 신청 기간은 언제인가요?",
  "기숙사 신청 방법이 궁금합니다.",
  "오늘 학식 메뉴가 뭐예요?",
]

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSend = async () => {
    if (input.trim() === "") return

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // 로딩 메시지 추가
    const loadingMessage: Message = {
      id: messages.length + 2,
      sender: "bot",
      text: "답변을 생성 중입니다...",
      isLoading: true,
    }
    setMessages((prev) => [...prev, loadingMessage])

    // 봇 응답 생성
    const response = await getBotResponse(input)

    // 로딩 메시지를 실제 응답으로 교체
    setMessages((prev) =>
      prev.map((msg) =>
        msg.isLoading
          ? {
              ...msg,
              text: response,
              isLoading: false,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }
          : msg,
      ),
    )
  }

  const handleQuickReply = async (reply: string) => {
    // 사용자 메시지로 빠른 응답 추가
    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, userMessage])

    // 로딩 메시지 추가
    const loadingMessage: Message = {
      id: messages.length + 2,
      sender: "bot",
      text: "답변을 생성 중입니다...",
      isLoading: true,
    }
    setMessages((prev) => [...prev, loadingMessage])

    // 봇 응답 생성
    const response = await getBotResponse(reply)

    // 로딩 메시지를 실제 응답으로 교체
    setMessages((prev) =>
      prev.map((msg) =>
        msg.isLoading
          ? {
              ...msg,
              text: response,
              isLoading: false,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }
          : msg,
      ),
    )
  }

 const getBotResponse = async (text: string): Promise<string> => {
  try {
    // 공지사항 관련 요청
    if (text.includes("학사공지")) {
      return await getNotice("학사");
    } else if (text.includes("장학공지") || text.includes("장학금 공지")) {
      return await getNotice("장학");
    } else if (text.includes("일반공지") || text.includes("한경공지")) {
      return await getNotice("일반");
    } else if (text.includes("학사일정")) {
      return await getNotice("학사일정");
    }

    // 식단 관련 최신 메뉴 반환 함수
    async function getLatestMenu(category: string, label: string) {
      try {
        const menus = await getMenuForCategory(category);
        if (menus.length === 0) {
          return `${label} 식단 정보가 없습니다.`;
        }

        let response = `${label} 최근 식단 정보입니다:\n`;

        for (const item of menus) {
          response += `\n${item.date} (${item.time})\n`;

          if (category === "기숙사식단") {
            const mealMap: Record<string, string[]> = {
              아침: [],
              점심: [],
              저녁: [],
            };
            let currentMeal = "";

            for (const line of item.menu) {
              if (line.includes("천원의 아침밥") || line.includes("08:00")) {
                currentMeal = "아침";
              } else if (line.includes("12:00") || line.includes("점심")) {
                currentMeal = "점심";
              } else if (line.includes("17:00") || line.includes("저녁")) {
                currentMeal = "저녁";
              }

              if (currentMeal) {
                mealMap[currentMeal].push(line);
              }
            }

            for (const meal of ["아침", "점심", "저녁"]) {
              if (mealMap[meal].length > 0) {
                response += `[${meal}]\n`;
                mealMap[meal].forEach(line => {
                  response += `- ${line.trim()}\n`;
                });
                response += `\n`;
              }
            }
          } else {
            // 학생/교직원 식단: 메뉴 항목만 출력
            response += item.menu.map(line => `- ${line}`).join("\n") + "\n\n";
          }
        }

        return response.trim();
      } catch (error) {
        console.error(`${label} 오류:`, error);
        return `${label} 정보를 가져오는 데 오류가 발생했습니다.`;
      }
    }

    // 식단 관련 요청 처리
    if (
      text.includes("학생식단") ||
      text.includes("학생 학식") ||
      text.includes("학생 메뉴")
    ) {
      return await getLatestMenu("학생식단", "학생식단");
    } else if (
      text.includes("교직원식단") ||
      text.includes("교직원 학식") ||
      text.includes("교직원 메뉴")
    ) {
      return await getLatestMenu("교직원식단", "교직원식단");
    } else if (
      text.includes("기숙사식단") ||
      text.includes("기숙사 학식") ||
      text.includes("기숙사 메뉴")
    ) {
      return await getLatestMenu("기숙사식단", "기숙사식단");
    } else if (
      text.includes("식단") || text.includes("학식") || text.includes("메뉴") ||
      text.includes("밥") || text.includes("점심") || text.includes("저녁")
    ) {
      return await getLatestMenu("학생식단", "오늘의 식단");
    }

    // 기타 고정 응답
    if (text.includes("수강 신청")) {
      return "수강 신청은 학교 포털 사이트에서 가능합니다. 신청 기간은 2월 15일부터 2월 28일까지입니다.";
    } else if (text.includes("장학금")) {
      return "장학금 신청은 매 학기 시작 전 한 달 전부터 가능합니다. 자세한 내용은 학생지원과에 문의해주세요.";
    } else if (text.includes("기숙사")) {
      return "기숙사 신청은 학교 홈페이지 기숙사 메뉴에서 확인하실 수 있습니다.";
    }

    return "안녕하세요! 학사, 장학, 일반 공지사항이나 학식 정보 등에 대해 물어보세요.";
  } catch (error) {
    console.error("getBotResponse 전체 오류:", error);
    return "요청을 처리하는 중 오류가 발생했습니다.";
  }
};


    

  // 새 메시지가 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 사이드바 */}
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      {/* 메인 채팅 영역 */}
      <div className="flex-1 flex flex-col h-full">
        {/* 헤더 */}
        <header className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="mr-4 md:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-teal-400 flex items-center justify-center text-white font-bold mr-3 shadow-sm">
                HK
              </div>
              <div>
                <h1 className="text-lg font-semibold">한경대학교 챗봇</h1>
                <p className="text-xs text-gray-500">항상 도움을 드릴 준비가 되어 있어요</p>
              </div>
            </div>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </header>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "bot" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-teal-400 flex items-center justify-center text-white font-bold mr-2 shadow-sm">
                  HK
                </div>
              )}
              <div className="max-w-[80%]">
                <div
                  className={`p-3 rounded-2xl shadow-sm ${
                    message.sender === "user" ? "bg-gradient-to-r from-purple-500 to-teal-500 text-white" : "bg-white"
                  }`}
                >
                  {message.isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-pulse flex space-x-1">
                        <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animation-delay-200"></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animation-delay-400"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="whitespace-pre-line">{message.text}</div>
                  )}
                </div>
                {message.timestamp && (
                  <div
                    className={`text-xs text-gray-500 mt-1 ${message.sender === "user" ? "text-right" : "text-left"}`}
                  >
                    {message.timestamp}
                  </div>
                )}
              </div>
              {message.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center ml-2 shadow-sm">
                  나
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 빠른 응답 버튼 */}
        <div className="p-3 bg-white border-t flex flex-wrap justify-center gap-2">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => handleQuickReply(reply)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm hover:bg-gray-100 transition-colors shadow-sm"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* 입력 영역 */}
        <div className="p-4 bg-white border-t flex items-center">
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="메시지를 입력하세요..."
            className="flex-1 p-3 mx-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 bg-gray-50"
          />
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors mr-2">
            <Smile size={20} />
          </button>
          <Button
            onClick={handleSend}
            className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-teal-500 text-white shadow-md hover:shadow-lg transition-shadow"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}