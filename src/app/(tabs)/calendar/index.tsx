import Header, { Title } from "@/components/ui/header";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  CalendarProvider,
  CalendarUtils,
  ExpandableCalendar,
  ExpandableCalendarProps,
} from "react-native-calendars";

export default function CalendarTasks() {
  const today = CalendarUtils.getCalendarDateString(new Date());

  const RenderCalendar = useCallback((props: ExpandableCalendarProps) => {
    return <ExpandableCalendar {...props} />;
  }, []);

  return (
    <CalendarProvider
      date={today}
      showTodayButton
      todayButtonStyle={{ margin: 20 }}
    >
      <View className="relative flex flex-col w-full min-h-screen bg-slate-700 pb-36">
        <Header>
          <Title title="Calendar Tasks" />
        </Header>
        <RenderCalendar
          firstDay={0}
          hideArrows={false}
          hideKnob={false}
          allowShadow={true}
          style={styles.calendar}
          headerStyle={styles.headerCalendar}
          theme={{
            textMonthFontSize: 16,
            monthTextColor: "#818cf8",
            todayTextColor: "#4338ca",
            selectedDayTextColor: "#e4e4e7",
            arrowColor: "#818cf8",
            calendarBackground: "#1e293b",
            dayTextColor: "#e4e4e7",
            textDisabledColor: "#334155",
          }}
        />
        <View>
          <Text>agenda</Text>
        </View>
      </View>
    </CalendarProvider>
  );
}

const styles = StyleSheet.create({
  calendar: {
    backgroundColor: "#1e293b",
  },
  headerCalendar: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#52525b",
    paddingBottom: 10,
    marginBottom: 10,
  },
});
