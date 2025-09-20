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
  Bot,
  Sparkles,
} from "lucide-react"
import ImageCarousel from "./image-carousel"
import ImageModal from "./image-modal"

type SidebarProps = {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (isOpen: boolean) => void
  onCalendarClick: () => void
  onMenuClick: (menu: string) => void
}

type MenuItem = {
  name: string
  icon: React.ReactNode
  url?: string
  onClick?: () => void
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
    <div className="mb-4 border rounded-lg overflow-hidden">
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

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen, onCalendarClick, onMenuClick }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("학사 일정")
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImageUrl, setSelectedImageUrl] = useState("")
  const [selectedImageLink, setSelectedImageLink] = useState("")

  const carouselImages = [
    {
      src: "/poster3.png",
      alt: "공모전",
      title: "제6회 국립대학육성사업 영상 콘텐츠 공모전",
      link: "https://www.hknu.ac.kr/kor/561/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGa29yJTJGNjklMkY4OTYxMyUyRmFydGNsVmlldy5kbyUzRg%3D%3D",
    },
    {
      src: "/poster2.jpg",
      alt: "홍보",
      title: "학과(전공) 홍보 영상 공모전 개최",
      link: "https://www.hknu.ac.kr/kor/561/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGa29yJTJGNjklMkY4OTU2NyUyRmFydGNsVmlldy5kbyUzRg%3D%3D",
    },
    {
      src: "/poster.jpg",
      alt: "학술 행사",
      title: "2025 학술제 안내",
    },
  ]

  const menuItems: MenuItem[] = [
    { name: "학사 일정", icon: <Calendar className="w-5 h-5" />, onClick: onCalendarClick },
    { name: "수강 신청", icon: <BookText className="w-5 h-5" />, url: "https://sugang.hknu.ac.kr/login" },
    { name: "도서관", icon: <Library className="w-5 h-5" />, url: "https://lib.hknu.ac.kr/" },
  ]

  const mealMenuItems = ["학생식당", "기숙사식당", "교직원식당"]

  // 빠른 링크 항목
  const quickLinks: QuickLinkItem[] = [
    { name: "학교 홈페이지", icon: <Globe className="w-4 h-4" />, url: "https://www.hknu.ac.kr/" },
    {
      name: "이캠퍼스",
      icon: <BookText className="w-4 h-4" />,
      url: "https://cyber.hknu.ac.kr/ilos/main/main_form.acl",
    },
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

  const openImageModal = (src: string, link?: string) => {
    setSelectedImageUrl(src)
    setSelectedImageLink(link || "")
    setIsImageModalOpen(true)
  }

  const closeImageModal = () => {
    setIsImageModalOpen(false)
    setSelectedImageUrl("")
    setSelectedImageLink("")
  }

  const handleMenuClick = (item: MenuItem) => {
    setActiveItem(item.name)

    if (item.name === "학식 메뉴") {
      onMenuClick(item.name)
    }
    // onClick 함수가 있으면 실행 (캘린더 등)
    else if (item.onClick) {
      item.onClick()
    }
    // URL이 있으면 해당 URL로 이동
    else if (item.url) {
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
            <div className="relative w-10 h-10">
              {/* Shadow layers for depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-lg translate-y-1 opacity-40 blur-sm"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-lg translate-y-0.5 opacity-60"></div>

              {/* Main badge */}
              <div className="relative w-full h-full bg-gradient-to-br from-primary via-primary to-secondary rounded-lg flex items-center justify-center border-2 border-background shadow-lg">
                {/* Inner circle for depth */}
                <div className="absolute inset-1 bg-gradient-to-br from-primary-foreground/10 to-transparent rounded-lg"></div>

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
            <div className="ml-3">
              <h2 className="text-sm font-semibold">한경국립대학교</h2>
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
          {/* 캐러셀 섹션 */}
          <div className="p-4 pb-0">
            <h3 className="text-sm font-medium text-gray-700 mb-2">CAMPUS NEWS</h3>
            <ImageCarousel
              images={carouselImages}
              height="h-80"
              onImageClick={(src, link) => openImageModal(src, link)}
            />
            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
              <p>한경국립대학교의 최신 소식과 이벤트를 확인하세요. 캠퍼스 내 다양한 활동과 학술 행사에 참여해보세요.</p>
            </div>
          </div>

          {/* 사이드바 메뉴 */}
          <div className="px-4 mb-4 mt-8">
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
                  } ${item.url || item.onClick ? "cursor-pointer" : ""}`}
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
            <CollapsibleSection title="학식 메뉴" icon={<Coffee className="w-5 h-5" />}>
              <div className="space-y-2">
                {mealMenuItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => onMenuClick(item)}
                    className="w-full flex items-center px-4 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </CollapsibleSection>
          </div>

          {/* 접을 수 있는 섹션들 */}
          <div className="px-4 mb-4">
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

          <div className="px-4 mb-4">
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
          </div>

          <div className="px-4 mb-8">
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
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={closeImageModal}
        imageUrl={selectedImageUrl}
        link={selectedImageLink}
      />
    </>
  )
}
