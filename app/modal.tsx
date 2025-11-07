import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import {
  format,
  eachDayOfInterval,
  isWithinInterval,
  parseISO,
  startOfDay,
  isSameDay,
} from 'date-fns';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useAppTheme } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/Spacing';
import { TextStyles } from '@/constants/Typography';
import { Colors } from '@/constants/theme';

// Setup for react-native-calendars
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

// Data from guide
interface AcademicEvent {
  id: number;
  startDate: string; // Use ISO string for consistency
  endDate: string;   // Use ISO string for consistency
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
    description: '01.06 (월) ~ 02.27 (목) 1차 온라인 복학 신청',
    type: 'academic',
  },
  // ... more events can be added here
];

export default function CalendarModalScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );

  const markedDates = academicEvents.reduce((acc, event) => {
    const periodColor = theme.primary.main;
    const interval = {
      start: startOfDay(parseISO(event.startDate)),
      end: startOfDay(parseISO(event.endDate)),
    };

    const daysInInterval = eachDayOfInterval(interval);

    daysInInterval.forEach((day) => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const isStart = isSameDay(day, interval.start);
      const isEnd = isSameDay(day, interval.end);

      acc[dateKey] = {
        ...acc[dateKey],
        color: periodColor,
        textColor: theme.neutral.white,
        startingDay: isStart,
        endingDay: isEnd,
      };
      if (daysInInterval.length === 1) {
        acc[dateKey].startingDay = true;
        acc[dateKey].endingDay = true;
      }
    });

    return acc;
  }, {} as any);

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
      paddingTop: Spacing.xl, // Added padding for status bar
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
      textAlign: 'center',
      color: theme.neutral.gray400,
      marginTop: Spacing.xl,
      ...TextStyles.body,
    },
    closeButton: {
      marginTop: Spacing.lg,
      backgroundColor: theme.primary.main,
      borderRadius: 12,
    },
    closeButtonText: {
      ...TextStyles.button,
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
        markingType={'period'}
        markedDates={{
          ...markedDates,
          [selectedDate]: { ...(markedDates[selectedDate] || {}), selected: true, color: theme.secondary.main, disableTouchEvent: true },
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