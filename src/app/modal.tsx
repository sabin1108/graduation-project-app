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
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Button, Card } from 'react-native-paper';

import { Spacing } from '@/constants/Spacing';
import { Colors } from '@/constants/theme';
import { TextStyles } from '@/constants/Typography';
import { academicEvents } from '@/data/academic-events';
import { useAppTheme } from '@/hooks/use-theme-color';
import { AcademicEvent } from '@/types/calendar';

// react-native-calendars 설정
LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월',
  ],
  monthNamesShort: [
    '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월',
  ],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

export default function CalendarModalScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const markedDates = useMemo(() => {
    return academicEvents.reduce<
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
          textColor: theme.neutral.white,
        };

        if (isStart) period.startingDay = true;
        if (isEnd) period.endingDay = true;

        if (!acc[dateKey]) {
          acc[dateKey] = { periods: [] };
        }
        acc[dateKey].periods.push(period);
      });

      return acc;
    }, {});
  }, [theme.neutral.white]);

  const eventsForSelectedDate = useMemo(() => {
    return academicEvents.filter((event) => {
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
  }, [selectedDate]);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.neutral.gray50,
      padding: Spacing.lg,
    },
    title: {
      ...TextStyles.h2,
      color: theme.neutral.gray900,
      marginBottom: Spacing.lg,
      paddingTop: Spacing.xl,
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
  }), [theme]);

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
