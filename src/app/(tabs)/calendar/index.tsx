import Header, { Title } from "@/components/ui/header";
import { TasksToday } from "@/hooks/taksToday";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Calendar,
  CalendarProvider,
  CalendarUtils,
  ExpandableCalendar,
} from "react-native-calendars";

export default function CalendarTasks() {
  const date = new Date();
  const today = CalendarUtils.getCalendarDateString(date);
  const [calendarType, setCalendarType] = useState<"week" | "month">("week");
  const { tasksDay, getMarkedDates, setSelectedDay } = TasksToday({ date });

  return (
    // <CalendarProvider
    //   date={today}
    //   showTodayButton
    //   todayButtonStyle={{ margin: 20 }}
    // >
    <View className="relative flex flex-col w-full min-h-screen bg-slate-700 pb-36">
      <Header>
        <Title title="Calendar Tasks" />
      </Header>
      <Calendar
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
        onDayPress={setSelectedDay}
        markingType="multi-period"
        markedDates={getMarkedDates()}
      />
      <View>
        {tasksDay?.map((task) => (
          <Text key={task.id}>{task.name}</Text>
        ))}
      </View>
    </View>
    // </CalendarProvider>
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
