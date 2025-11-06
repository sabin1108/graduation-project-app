"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, GraduationCap, BookOpen, Trophy, Users, Clock } from "lucide-react"
import { useState, useMemo, useCallback, useRef, useEffect } from "react"

import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  startOfWeek,
  endOfWeek,
  differenceInDays,
} from "date-fns"
import { ko } from "date-fns/locale"
import { cn } from "@/lib/utils"

// --- TYPE DEFINITIONS ---
interface CalendarModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface AcademicEvent {
  id: number
  startDate: Date
  endDate: Date
  title: string
  description: string
  type: string
}

interface EventLayout {
  event: AcademicEvent
  track: number
  startWeek: number
  startDay: number
  duration: number
}

// --- DATA ---
const academicEventsData: AcademicEvent[] = [
  {
    startDate: new Date(2025, 0, 6),
    endDate: new Date(2025, 1, 27),
    title: "1차 온라인 복학 신청",
    description: "01.06 (월) ~ 02.27 (목) 1차 온라인 복학 신청",
    type: "academic",
  },
  {
    startDate: new Date(2025, 0, 6),
    endDate: new Date(2025, 0, 10),
    title: "전과 및 재입학 신청",
    description: "01.06 (월) ~ 01.10 (금) 전과 및 재입학 신청",
    type: "academic",
  },
  {
    startDate: new Date(2025, 0, 13),
    endDate: new Date(2025, 0, 15),
    title: "복수, 융합, 연계 전공 신청",
    description: "01.13 (월) ~ 01.15 (수) 복수, 융합, 연계 전공 신청",
    type: "registration",
  },
  {
    startDate: new Date(2025, 0, 20),
    endDate: new Date(2025, 0, 21),
    title: "예비 수강신청 (장바구니)",
    description: "01.20 (월) ~ 01.21 (화) 예비 수강신청 (장바구니)",
    type: "registration",
  },
  {
    startDate: new Date(2025, 1, 21),
    endDate: new Date(2025, 1, 21),
    title: "2024학년도 전기 학위수여식",
    description: "02.21 (금) 2024학년도 전기 학위수여식",
    type: "ceremony",
  },
  {
    startDate: new Date(2025, 1, 24),
    endDate: new Date(2025, 1, 28),
    title: "2025-1학기 재학생 등록기간",
    description: "02.24 (월) ~ 02.28 (금) 2025-1학기 재학생 등록기간",
    type: "academic",
  },
  {
    startDate: new Date(2025, 2, 4),
    endDate: new Date(2025, 2, 4),
    title: "1학기 개강",
    description: "03.04 (화) 1학기 개강",
    type: "academic",
  },
  {
    startDate: new Date(2025, 3, 15),
    endDate: new Date(2025, 3, 15),
    title: "개교기념일",
    description: "04.15 (화) 개교기념일",
    type: "holiday",
  },
  {
    startDate: new Date(2025, 3, 23),
    endDate: new Date(2025, 3, 29),
    title: "1학기 중간시험",
    description: "04.23 (수) ~ 04.29 (화) 1학기 중간시험",
    type: "exam",
  },
  {
    startDate: new Date(2025, 4, 20),
    endDate: new Date(2025, 4, 22),
    title: "한경체전(체육대회)",
    description: "05.20 (화) ~ 05.22 (목) 한경체전(체육대회)",
    type: "festival",
  },
  {
    startDate: new Date(2025, 5, 11),
    endDate: new Date(2025, 5, 20),
    title: "1학기 기말시험",
    description: "06.11 (수) ~ 06.20 (금) 1학기 기말시험",
    type: "exam",
  },
  {
    startDate: new Date(2025, 5, 20),
    endDate: new Date(2025, 5, 20),
    title: "종강",
    description: "06.20 (금) 종강",
    type: "academic",
  },
  {
    startDate: new Date(2025, 5, 23),
    endDate: new Date(2025, 6, 11),
    title: "하계 계절수업",
    description: "06.23 (월) ~ 07.11 (금) 하계 계절수업",
    type: "academic",
  },
  {
    startDate: new Date(2025, 8, 29),
    endDate: new Date(2025, 8, 30),
    title: "한경 대동제 (축제)",
    description: "09.29 (월) ~ 09.30 (화) 한경 대동제 (축제)",
    type: "festival",
  },
  {
    startDate: new Date(2025, 9, 25),
    endDate: new Date(2025, 9, 31),
    title: "2학기 중간시험",
    description: "10.25 (토) ~ 10.31 (금) 2학기 중간시험",
    type: "exam",
  },
  {
    startDate: new Date(2025, 11, 13),
    endDate: new Date(2025, 11, 19),
    title: "2학기 기말시험",
    description: "12.13 (토) ~ 12.19 (금) 2학기 기말시험",
    type: "exam",
  },
  {
    startDate: new Date(2025, 11, 19),
    endDate: new Date(2025, 11, 19),
    title: "종강",
    description: "12.19 (금) 종강",
    type: "academic",
  },
  {
    startDate: new Date(2025, 11, 22),
    endDate: new Date(2026, 0, 13),
    title: "동계 계절수업",
    description: "12.22 (월) ~ 01.13 (화) 동계 계절수업",
    type: "academic",
  },
].map((e, i) => ({ ...e, id: i + 1 }))

// --- HELPERS ---
const getEventTypeConfig = (type: string) => {
  switch (type) {
    case "exam":
      return {
        color: "bg-red-500",
        lightColor: "bg-red-50 border-red-200 text-red-800",
        icon: BookOpen,
        label: "시험",
      }
    case "holiday":
      return {
        color: "bg-emerald-500",
        lightColor: "bg-emerald-50 border-emerald-200 text-emerald-800",
        icon: Calendar,
        label: "휴일",
      }
    case "academic":
      return {
        color: "bg-blue-500",
        lightColor: "bg-blue-50 border-blue-200 text-blue-800",
        icon: GraduationCap,
        label: "학사",
      }
    case "registration":
      return {
        color: "bg-purple-500",
        lightColor: "bg-purple-50 border-purple-200 text-purple-800",
        icon: Users,
        label: "신청",
      }
    case "ceremony":
      return {
        color: "bg-amber-500",
        lightColor: "bg-amber-50 border-amber-200 text-amber-800",
        icon: GraduationCap,
        label: "행사",
      }
    case "festival":
      return {
        color: "bg-pink-500",
        lightColor: "bg-pink-50 border-pink-200 text-pink-800",
        icon: Trophy,
        label: "축제",
      }
    default:
      return {
        color: "bg-gray-500",
        lightColor: "bg-gray-50 border-gray-200 text-gray-800",
        icon: Calendar,
        label: "기타",
      }
  }
}

// --- COMPONENT ---
export default function CalendarModal({ open, onOpenChange }: CalendarModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const [dynamicCellHeight, setDynamicCellHeight] = useState(128) // Default to 128
  const dayCellRef = useRef<HTMLButtonElement>(null) // Ref for a day cell


  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1))


  // Add useEffect to measure cell height
  useEffect(() => {
    if (dayCellRef.current) {
      setDynamicCellHeight(dayCellRef.current.offsetHeight)
    }
  }, [currentDate, dayCellRef.current?.offsetHeight]) // Re-measure if currentDate changes or ref's height changes


  const { weeks, eventLayouts } = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
    const monthEnd = endOfMonth(currentDate)
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
    const visibleDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

    const weeks: Date[][] = []
    for (let i = 0; i < visibleDays.length; i += 7) {
      weeks.push(visibleDays.slice(i, i + 7))
    }

    const visibleEvents = academicEventsData.filter(
      (event) => event.startDate <= calendarEnd && event.endDate >= calendarStart,
    )

    const sortedEvents = [...visibleEvents].sort((a, b) => {
      const diff = differenceInDays(a.startDate, b.startDate)
      return diff === 0 ? differenceInDays(b.endDate, a.endDate) : diff
    })

    const eventLayouts: EventLayout[] = []
    const weeklyTracks: number[][] = weeks.map(() => [])
    const MAX_TRACKS_PER_WEEK = 6

    for (const event of sortedEvents) {
      const eventStart = event.startDate < calendarStart ? calendarStart : event.startDate
      const eventEnd = event.endDate > calendarEnd ? calendarEnd : event.endDate

      const startWeekIndex = weeks.findIndex((week) => eventStart >= week[0] && eventStart <= week[6])
      const endWeekIndex = weeks.findIndex((week) => eventEnd >= week[0] && eventEnd <= week[6])

      if (startWeekIndex === -1) continue

      for (let weekIndex = startWeekIndex; weekIndex <= endWeekIndex; weekIndex++) {
        const weekStart = weeks[weekIndex][0]
        const weekEnd = weeks[weekIndex][6]

        const segmentStart = eventStart > weekStart ? eventStart : weekStart
        const segmentEnd = eventEnd < weekEnd ? eventEnd : weekEnd

        const startDayIndex = segmentStart.getDay()
        const duration = differenceInDays(segmentEnd, segmentStart) + 1

        let trackIndex = 0
        while (trackIndex < MAX_TRACKS_PER_WEEK && weeklyTracks[weekIndex].includes(trackIndex)) {
          trackIndex++
        }

        if (trackIndex >= MAX_TRACKS_PER_WEEK) continue

        weeklyTracks[weekIndex].push(trackIndex)

        eventLayouts.push({
          event,
          track: trackIndex,
          startWeek: weekIndex,
          startDay: startDayIndex,
          duration: Math.min(duration, 7 - startDayIndex),
        })
      }
    }

    return { weeks, eventLayouts }

  }, [currentDate, dynamicCellHeight])


  const getEventsForDate = useCallback((date: Date) => {
    return academicEventsData.filter((event) => date >= event.startDate && date <= event.endDate)
  }, [])

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent className="w-full max-w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden bg-gradient-to-br from-slate-50 to-white border-0 shadow-2xl">


        <DialogHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white -m-6 mb-0 p-5 rounded-t-lg">
          <DialogTitle className="flex items-center gap-3 text-lg font-bold">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Calendar className="h-5 w-5" />
            </div>
            한경국립대학교 학사일정
          </DialogTitle>
        </DialogHeader>


        <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-5 h-auto md:h-[calc(90vh-100px)]">

          {/* Calendar Section */}
          <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-100 p-5 overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-5">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousMonth}
                className="border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 bg-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  {format(currentDate, "yyyy년 MM월", { locale: ko })}
                </h2>
                <p className="text-xs text-gray-500">{format(new Date(), "yyyy년 MM월", { locale: ko })}과 비교</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextMonth}
                className="border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 bg-transparent"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-2">
              {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
                <div
                  key={day}
                  className={cn(
                    "py-2 text-center font-semibold text-sm",
                    index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : "text-gray-600",
                  )}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid Container - 크기 제한 */}

            <div className="w-full h-auto max-w-full overflow-x-auto">

              <div className="relative w-full">
                <div className="grid grid-cols-7 border border-gray-200 rounded-lg overflow-hidden w-full">
                  {/* Day cells */}
                  {weeks.flat().map((day, index) => {
                    return (
                      <button
                        key={day.toISOString()}
                        ref={index === 0 ? dayCellRef : null}
                        onClick={() => setSelectedDate(day)}
                        className={cn(
                          "aspect-square border-r border-b border-gray-100 transition-all duration-200 hover:bg-gray-50 relative group overflow-hidden w-full",

                          !isSameMonth(day, currentDate) && "text-gray-300 bg-gray-50/50",
                          isToday(day) && "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200",
                          selectedDate &&
                            isSameDay(day, selectedDate) &&
                            "bg-gradient-to-br from-indigo-100 to-purple-100 border-indigo-300 ring-2 ring-indigo-200",
                          (index + 1) % 7 === 0 && "border-r-0",
                          index >= weeks.flat().length - 7 && "border-b-0",
                        )}
                      >
                        {/* Date Number - 상단 고정 영역 */}
                        <div className="absolute top-0 left-0 right-0 h-8 flex items-center justify-center z-30">
                          <span
                            className={cn(
                              "text-xs font-semibold inline-flex items-center justify-center w-5 h-5 rounded-full transition-all duration-200",
                              isToday(day) && "bg-indigo-600 text-white shadow-md",
                              !isToday(day) && day.getDay() === 0 && "text-red-500",
                              !isToday(day) && day.getDay() === 6 && "text-blue-500",
                              !isSameMonth(day, currentDate) && "text-gray-400",
                              isSameMonth(day, currentDate) && !isToday(day) && "text-gray-700",
                            )}
                          >
                            {format(day, "d")}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Events overlay - 연속된 막대 */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden w-full h-full">
                  {eventLayouts.map((layout, layoutIndex) => {
                    const { event, track, startWeek, startDay, duration } = layout
                    const config = getEventTypeConfig(event.type)

                    const cellHeight = dynamicCellHeight

                    const dateAreaHeight = 32
                    const availableHeight = cellHeight - dateAreaHeight - 8
                    const eventHeight = 12
                    const trackSpacing = 14

                    const maxTop = dateAreaHeight + (availableHeight - eventHeight)
                    const eventTop = Math.min(dateAreaHeight + track * trackSpacing, maxTop)

                    return (
                      <div
                        key={`${event.id}-${layoutIndex}`}
                        onClick={() => setSelectedDate(event.startDate)}
                        className={cn(
                          "absolute text-white pointer-events-auto cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 font-medium overflow-hidden rounded-sm",
                          config.color,
                        )}
                        style={{
                          top: `calc(${(startWeek * 100) / weeks.length}% + ${eventTop}px)`,
                          left: `calc(${(startDay * 100) / 7}% + 4px)`,
                          width: `calc(${(duration * 100) / 7}% - 8px)`,
                          height: `${eventHeight}px`,
                          zIndex: 20,
                        }}
                        title={event.description}
                      >
                        <div className="flex items-center h-full px-1">
                          <span className="text-xs leading-none truncate font-medium">{event.title}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Event Details Sidebar */}
          <div className="w-full md:w-80 bg-white rounded-xl shadow-lg border border-gray-100 p-5 overflow-hidden flex flex-col">

            <div className="mb-5">
              <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-600" />
                {selectedDate ? format(selectedDate, "MM월 dd일 일정", { locale: ko }) : "날짜를 선택하세요"}
              </h3>
              {selectedDate && (
                <p className="text-xs text-gray-500">{format(selectedDate, "yyyy년 MM월 dd일 EEEE", { locale: ko })}</p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {selectedDate && selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => {
                    const config = getEventTypeConfig(event.type)
                    const Icon = config.icon

                    return (
                      <div
                        key={event.id}
                        className={cn(
                          "p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md",
                          config.lightColor,
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn("p-1.5 rounded-lg text-white", config.color)}>
                            <Icon className="h-3 w-3" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-xs leading-tight truncate">{event.title}</h4>
                              <Badge variant="secondary" className="text-xs flex-shrink-0">
                                {config.label}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">{event.description}</p>
                            <div className="mt-1 text-xs text-gray-500">
                              {format(event.startDate, "MM.dd", { locale: ko })}
                              {!isSameDay(event.startDate, event.endDate) &&
                                ` ~ ${format(event.endDate, "MM.dd", { locale: ko })}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-gray-400" />
                  </div>
                  <h4 className="font-medium text-gray-600 mb-2 text-sm">
                    {selectedDate ? "일정이 없습니다" : "날짜를 선택해주세요"}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {selectedDate
                      ? "이 날에는 예정된 학사 일정이 없습니다."
                      : "캘린더에서 날짜를 클릭하면 해당 일정을 확인할 수 있습니다."}
                  </p>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="mt-5 pt-4 border-t border-gray-200">
              <h4 className="text-xs font-semibold text-gray-700 mb-3">일정 유형</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { type: "exam", label: "시험" },
                  { type: "academic", label: "학사" },
                  { type: "registration", label: "신청" },
                  { type: "festival", label: "축제" },
                  { type: "ceremony", label: "행사" },
                  { type: "holiday", label: "휴일" },
                ].map(({ type, label }) => {
                  const config = getEventTypeConfig(type)
                  return (
                    <div key={type} className="flex items-center gap-2">
                      <div className={cn("w-2.5 h-2.5 rounded-full", config.color)} />
                      <span className="text-gray-600 text-xs">{label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
