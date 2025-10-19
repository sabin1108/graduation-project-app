import {
  eachDayOfInterval,
  format,
  isSameDay,
  isWithinInterval,
  parseISO,
  startOfDay,
} from 'date-fns';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Button, Card } from 'react-native-paper';

import { Spacing } from '@/constants/Spacing';
import { Colors } from '@/constants/theme';
import { TextStyles } from '@/constants/Typography';
import { useAppTheme } from '@/hooks/use-theme-color';

// react-native-calendars 설정
LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

// 가이드의 데이터
interface AcademicEvent {
  id: number;
  startDate: string; // 일관성을 위해 ISO 문자열 사용
  endDate: string;   // 일관성을 위해 ISO 문자열 사용
  title: string;
  description: string;
  type: string;
}

const academicEvents: AcademicEvent[] = [
  {
    id: 1,
    startDate: '2025-01-06',
    endDate: '2025-02-27',
    title: '1차 온라인 복학 신청',
    description: '기간: 01.06 (월) ~ 02.27 (목)',
    type: 'academic',
  },
  {
    id: 2,
    startDate: '2025-01-06',
    endDate: '2025-01-10',
    title: '전과 및 재입학 신청',
    description: '기간: 01.06 (월) ~ 01.10 (금)',
    type: 'academic',
  },
  {
    id: 3,
    startDate: '2025-01-13',
    endDate: '2025-01-15',
    title: '복수, 융합, 연계 전공 신청',
    description: '기간: 01.13 (월) ~ 01.15 (수)',
    type: 'registration',
  },
  {
    id: 4,
    startDate: '2025-01-20',
    endDate: '2025-01-21',
    title: '예비 수강신청 (장바구니)',
    description: '기간: 01.20 (월) ~ 01.21 (화)',
    type: 'registration',
  },
  {
    id: 5,
    startDate: '2025-02-21',
    endDate: '2025-02-21',
    title: '2024학년도 전기 학위수여식',
    description: '기간: 02.21 (금)',
    type: 'ceremony',
  },
  {
    id: 6,
    startDate: '2025-02-24',
    endDate: '2025-02-28',
    title: '2025-1학기 재학생 등록기간',
    description: '기간: 02.24 (월) ~ 02.28 (금)',
    type: 'academic',
  },
  {
    id: 7,
    startDate: '2025-03-04',
    endDate: '2025-03-04',
    title: '1학기 개강',
    description: '기간: 03.04 (화)',
    type: 'academic',
  },
  {
    id: 8,
    startDate: '2025-04-15',
    endDate: '2025-04-15',
    title: '개교기념일',
    description: '기간: 04.15 (화)',
    type: 'holiday',
  },
  {
    id: 9,
    startDate: '2025-04-23',
    endDate: '2025-04-29',
    title: '1학기 중간시험',
    description: '기간: 04.23 (수) ~ 04.29 (화)',
    type: 'exam',
  },
  {
    id: 10,
    startDate: '2025-05-20',
    endDate: '2025-05-22',
    title: '한경체전(체육대회)',
    description: '기간: 05.20 (화) ~ 05.22 (목)',
    type: 'festival',
  },
  {
    id: 11,
    startDate: '2025-06-11',
    endDate: '2025-06-20',
    title: '1학기 기말시험',
    description: '기간: 06.11 (수) ~ 06.20 (금)',
    type: 'exam',
  },
  {
    id: 12,
    startDate: '2025-06-20',
    endDate: '2025-06-20',
    title: '종강',
    description: '기간: 06.20 (금)',
    type: 'academic',
  },
  {
    id: 13,
    startDate: '2025-06-23',
    endDate: '2025-07-11',
    title: '하계 계절수업',
    description: '기간: 06.23 (월) ~ 07.11 (금)',
    type: 'academic',
  },
  {
    id: 14,
    startDate: '2025-09-29',
    endDate: '2025-09-30',
    title: '한경 대동제 (축제)',
    description: '기간: 09.29 (월) ~ 09.30 (화)',
    type: 'festival',
  },
  {
    id: 15,
    startDate: '2025-10-25',
    endDate: '2025-10-31',
    title: '2학기 중간시험',
    description: '기간: 10.25 (토) ~ 10.31 (금)',
    type: 'exam',
  },
  {
    id: 16,
    startDate: '2025-12-13',
    endDate: '2025-12-19',
    title: '2학기 기말시험',
    description: '기간: 12.13 (토) ~ 12.19 (금)',
    type: 'exam',
  },
  {
    id: 17,
    startDate: '2025-12-19',
    endDate: '2025-12-19',
    title: '종강',
    description: '기간: 12.19 (금)',
    type: 'academic',
  },
  {
    id: 18,
    startDate: '2025-12-22',
    endDate: '2026-01-13',
    title: '동계 계절수업',
    description: '기간: 12.22 (월) ~ 2026.01.13 (화)',
    type: 'academic',
  },
];

export default function CalendarModalScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );
  const markedDates = academicEvents.reduce<
    Record<
      string,
      {
        periods: {
          color: string;
          textColor: string;
          startingDay?: boolean;
          endingDay?: boolean;
        }[];
      }
    >
  >((acc, event, index) => {
    const periodColor = Colors.event[index % Colors.event.length];
    const interval = {
      start: startOfDay(parseISO(event.startDate)),
      end: startOfDay(parseISO(event.endDate)),
    };

    const daysInInterval = eachDayOfInterval(interval);

    daysInInterval.forEach((day) => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const isStart = isSameDay(day, interval.start);
      const isEnd = isSameDay(day, interval.end);

      const period: {
        color: string;
        textColor: string;
        startingDay?: boolean;
        endingDay?: boolean;
      } = {
        color: periodColor,
        textColor: theme.neutral.white, // 대비를 위해 텍스트를 흰색으로 유지
      };

      if (isStart) {
        period.startingDay = true;
      }
      if (isEnd) {
        period.endingDay = true;
      }

      if (!acc[dateKey]) {
        acc[dateKey] = { periods: [] };
      }
      acc[dateKey].periods.push(period);
    });

    return acc;
  }, {});

  const eventsForSelectedDate = academicEvents.filter((event) => {
    try {
      const selected = startOfDay(parseISO(selectedDate));
      const interval = {
        start: startOfDay(parseISO(event.startDate)),
        end: startOfDay(parseISO(event.endDate)),
      };
      return isWithinInterval(selected, interval);
    } catch (e) {
      console.error('Error parsing date:', e);
      return false;
    }
  });
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.neutral.gray50,
      padding: Spacing.lg,
    },
    title: {
      ...TextStyles.h2,
      color: theme.neutral.gray900,
      marginBottom: Spacing.lg,
      paddingTop: Spacing.xl, // 상태 표시줄을 위한 패딩 추가
    },
    eventList: {
      marginTop: Spacing.lg,
      flex: 1,
    },
    eventCard: {
      marginBottom: Spacing.md,
      backgroundColor: theme.neutral.white,
      borderColor: theme.neutral.gray200,
      borderWidth: 1,
    },
    eventTitle: {
      ...TextStyles.body,
      fontFamily: 'NotoSansKR-Medium',
      color: theme.neutral.gray800,
      marginBottom: Spacing.xs,
    },
    eventDescription: {
      ...TextStyles.small,
      color: theme.neutral.gray600,
    },
    noEvents: {
      ...TextStyles.body,
      textAlign: 'center',
      color: theme.neutral.gray400,
      marginTop: Spacing.xl,
    },
    closeButton: {
      marginTop: Spacing.lg,
      backgroundColor: theme.primary.main,
      borderRadius: 12,
    },
    closeButtonText: {
      ...TextStyles.button,
      textTransform: 'none',
    },
  });

  const calendarTheme = {
    backgroundColor: theme.neutral.gray50,
    calendarBackground: theme.neutral.white,
    textSectionTitleColor: theme.neutral.gray500,
    selectedDayBackgroundColor: theme.secondary.main,
    selectedDayTextColor: theme.neutral.white,
    todayTextColor: theme.secondary.main,
    dayTextColor: theme.neutral.gray800,
    textDisabledColor: theme.neutral.gray400,
    arrowColor: theme.primary.main,
    monthTextColor: theme.primary.main,
    indicatorColor: theme.primary.main,
    textMonthFontFamily: 'NotoSansKR-Medium',
    textDayHeaderFontFamily: 'NotoSansKR-Regular',
    textDayFontSize: TextStyles.small.fontSize,
    textMonthFontSize: TextStyles.h3.fontSize,
    textDayHeaderFontSize: TextStyles.tiny.fontSize,
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.title}>학사 일정</Text>

      <Calendar
        markingType={'multi-period'}
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            ...(markedDates[selectedDate] || { periods: [] }),
            selected: true,
            disableTouchEvent: true,
          },
        }}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={calendarTheme}
        style={{
            borderRadius: 16,
            elevation: 2,
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 8,
        }}
      />

      <ScrollView style={styles.eventList}>
        {eventsForSelectedDate.length > 0 ? (
          eventsForSelectedDate.map((event) => (
            <Card key={event.id} style={styles.eventCard}>
              <Card.Content>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDescription}>{event.description}</Text>
              </Card.Content>
            </Card>
          ))
        ) : (
          <Text style={styles.noEvents}>
            선택된 날짜에 일정이 없습니다.
          </Text>
        )}
      </ScrollView>

      <Button mode="contained" onPress={() => router.back()} style={styles.closeButton} labelStyle={styles.closeButtonText}>
        닫기
      </Button>
    </View>
  );
}
