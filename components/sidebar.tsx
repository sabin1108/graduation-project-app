"use client"

import type React from "react"

import { useState } from "react"
import {
  Calendar,
  Coffee,
  BookText,
  Library,
  Phone,
  MapPin,
  Globe,
  Info,
  ChevronUp,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import ImageCarousel from "./image-carousel"

type SidebarProps = {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (isOpen: boolean) => void
}

type MenuItem = {
  name: string
  icon: React.ReactNode
  url?: string
}

type QuickLinkItem = {
  name: string
  icon: React.ReactNode
  url: string
}

type CollapsibleSectionProps = {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  defaultExpanded?: boolean
}

// 접을 수 있는 섹션 컴포넌트
const CollapsibleSection = ({ title, icon, children, defaultExpanded = false }: CollapsibleSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="mb-2 border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center">
          <span className="mr-2 text-purple-500">{icon}</span>
          <span className="text-sm font-medium">{title}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isExpanded ? "transform rotate-180" : ""}`}
        />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="p-3 bg-white">{children}</div>
      </div>
    </div>
  )
}

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("학사 일정")
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Sample carousel images
  const carouselImages = [
    {
      src: "/placeholder.svg?height=320&width=400",
      alt: "한경대학교 캠퍼스",
      title: "아름다운 한경대학교 캠퍼스",
    },
    {
      src: "/placeholder.svg?height=320&width=400",
      alt: "학생 활동",
      title: "다양한 학생 활동",
    },
    {
      src: "/placeholder.svg?height=320&width=400",
      alt: "학술 행사",
      title: "2025 학술제 안내",
    },
  ]

  const menuItems: MenuItem[] = [
    { name: "학사 일정", icon: <Calendar className="w-5 h-5" /> },
    { name: "수강 신청", icon: <BookText className="w-5 h-5" />, url: "https://sugang.hknu.ac.kr/login" },
    { name: "도서관", icon: <Library className="w-5 h-5" />, url: "https://lib.hknu.ac.kr/" },
    { name: "학식 메뉴", icon: <Coffee className="w-5 h-5" /> },
  ]

  // 빠른 링크 항목
  const quickLinks: QuickLinkItem[] = [
    { name: "학교 홈페이지", icon: <Globe className="w-4 h-4" />, url: "https://www.hknu.ac.kr/" },
    { name: "이캠퍼스", icon: <BookText className="w-4 h-4" />, url: "https://cyber.hknu.ac.kr/ilos/main/main_form.acl" },
    { name: "학사공지", icon: <Info className="w-4 h-4" />, url: "https://info.hknu.ac.kr/intro/index.html#/login" },
  ]

  // 연락처 정보
  const contactInfo = [
    { label: "학생지원과", value: "031-670-5333" },
    { label: "학사지원과", value: "031-670-5032" },
    { label: "도서관", value: "031-670-5502" },
  ]

  // 캠퍼스 정보
  const campusInfo = [
    { label: "주소", value: "경기도 안성시 중앙로 327" },
    { label: "우편번호", value: "17579" },
    { label: "팩스", value: "031-670-5009" },
  ]

  const handleMenuClick = (item: MenuItem) => {
    setActiveItem(item.name)

    // URL이 있으면 해당 URL로 이동
    if (item.url) {
      window.open(item.url, "_blank")
    }
  }

  // 스크롤 이벤트 핸들러
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop
    setShowScrollTop(scrollTop > 100)
  }

  // 맨 위로 스크롤
  const scrollToTop = () => {
    const scrollableDiv = document.getElementById("sidebar-scrollable")
    if (scrollableDiv) {
      scrollableDiv.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <>
      {/* 모바일 오버레이 */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* 사이드바 */}
      <div
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-50 flex flex-col h-screen`}
      >
        {/* 사이드바 헤더 - 고정 */}
        <div className="p-4 border-b bg-white">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 to-teal-400 flex items-center justify-center text-white font-bold shadow-md">
              HK
            </div>
            <div className="ml-3">
              <h2 className="text-sm font-semibold">한경대학교</h2>
              <p className="text-xs text-gray-500">학생 도우미 챗봇</p>
            </div>
          </div>
        </div>

        {/* 스크롤 가능한 콘텐츠 영역 */}
        <div
          id="sidebar-scrollable"
          className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          onScroll={handleScroll}
        >
          {/* 캐러셀 섹션 - 더 크게 만들기 */}
          <div className="p-4 pb-0">
            <h3 className="text-sm font-medium text-gray-700 mb-2">캠퍼스 소식</h3>
            <ImageCarousel images={carouselImages} height="h-80" />

            {/* 캐러셀 아래 설명 텍스트 추가 */}
            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
              <p>한경대학교의 최신 소식과 이벤트를 확인하세요. 캠퍼스 내 다양한 활동과 학술 행사에 참여해보세요.</p>
            </div>
          </div>

          {/* 여백 추가 */}
          <div className="h-8"></div>

          {/* 사이드바 메뉴 */}
          <div className="px-4 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">메뉴</h3>
            <div className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                    activeItem === item.name
                      ? "bg-gradient-to-r from-purple-100 to-teal-100 text-purple-600 font-medium shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  } ${item.url ? "cursor-pointer" : ""}`}
                >
                  <span className={`mr-3 ${activeItem === item.name ? "text-purple-500" : ""}`}>{item.icon}</span>
                  {item.name}
                  {item.url && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 ml-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 여백 추가 */}
          <div className="h-4"></div>

          {/* 접을 수 있는 섹션들 */}
          <div className="px-4 mb-6">
            <CollapsibleSection title="빠른 링크" icon={<Globe className="w-5 h-5" />} defaultExpanded={true}>
              <div className="space-y-2">
                {quickLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="mr-2 text-purple-500">{link.icon}</span>
                    {link.name}
                    <ChevronRight className="h-3 w-3 ml-auto text-gray-400" />
                  </a>
                ))}
              </div>
            </CollapsibleSection>
          </div>

          {/* 여백 추가 */}
          <div className="h-4"></div>

          {/* 하단 정보 섹션들 */}
          <div className="px-4 mb-8">
            <CollapsibleSection title="연락처" icon={<Phone className="w-5 h-5" />}>
              <div className="space-y-2">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-center p-2 text-sm">
                    <Phone className="w-4 h-4 text-purple-500 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            <div className="h-2"></div>

            <CollapsibleSection title="캠퍼스 정보" icon={<MapPin className="w-5 h-5" />}>
              <div className="space-y-2">
                {campusInfo.map((item, index) => (
                  <div key={index} className="flex items-start p-2 text-sm">
                    <MapPin className="w-4 h-4 text-purple-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          </div>

          {/* 하단 여백 */}
          <div className="h-16"></div>
        </div>

        {/* 맨 위로 스크롤 버튼 */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="absolute bottom-4 right-4 bg-purple-500 text-white p-2 rounded-full shadow-md hover:bg-purple-600 transition-colors"
            aria-label="맨 위로 스크롤"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        )}
      </div>
    </>
  )
}
