import { CardTask } from "@/components/tasks/cardTask";
import { TaskEditor } from "@/components/tasks/newTask";
import Header, { Title } from "@/components/ui/header";
import { TasksToday } from "@/hooks/taksToday";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Task,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Calendar,
  CalendarProvider,
  CalendarUtils,
  ExpandableCalendar,
} from "react-native-calendars";

export default function CalendarTasks() {
  const date = new Date();
  const today = CalendarUtils.getCalendarDateString(date);
  const {
    keyForm,
    tasksDay,
    getMarkedDates,
    setSelectedDay,
    openNewTaskForm,
    setOpenNewTaskForm,
    hideForm,
    createTask,
  } = TasksToday({ date });

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
          <Text className="text-zinc-200 font-semibold mt-2 text-2xl mx-4">
            Tasks
          </Text>
          <FlatList
            className="flex-col gap-2"
            data={tasksDay}
            keyExtractor={(item) => item.id}
            numColumns={1}
            renderItem={({ item }) => <CardTask task={item} className="m-3" />}
          />
        </View>
        <TouchableOpacity
          className="absolute right-8 top-[80vh] flex items-center justify-center bg-indigo-500 p-4 rounded-full"
          onPress={() => setOpenNewTaskForm(true)}
        >
          <MaterialIcons name="add-task" size={28} color="white" />
        </TouchableOpacity>
        <TaskEditor
          key={keyForm}
          open={openNewTaskForm}
          setHide={hideForm}
          onSave={createTask}
        />
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
