import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import AntDesign from "@expo/vector-icons/AntDesign";
import { DrawerBotton } from "../ui/drawerBotton";
import { formatDateToString } from "@/utils/formatDate";

interface DatePickerProps {
  open: boolean;
  setHide: () => void;
  startDate?: Date;
  endDate?: Date;
  onDatesChange: ({
    newStartDate,
    newEndDate,
  }: {
    newStartDate?: Date;
    newEndDate?: Date;
  }) => void;
}

export function DatePicker({
  open,
  setHide,
  startDate,
  endDate,
  onDatesChange,
}: DatePickerProps) {
  const [date, setDate] = useState<DateData>();
  const [selectedStartDate, setSelectedStartDate] = useState<DateData>();
  const [selectedEndDate, setSelectedEndDate] = useState<DateData>();
  const [selectedDate, setSelectedDate] = useState<"stardDate" | "endDate">(
    "stardDate"
  );

  useEffect(() => {
    if (startDate) {
      const formatedDate = formatDateToString(startDate);
      setSelectedStartDate({
        dateString: formatedDate,
        day: startDate.getDate(),
        month: startDate.getMonth() + 1,
        year: startDate.getFullYear(),
        timestamp: startDate.getTime(),
      });
    }
    if (endDate) {
      const formatedDate = formatDateToString(endDate);
      setSelectedEndDate({
        dateString: formatedDate,
        day: endDate.getDate(),
        month: endDate.getMonth() + 1,
        year: endDate.getFullYear(),
        timestamp: endDate.getTime(),
      });
    }
  }, [startDate, endDate]);

  const dateDataToDate = (dateData: DateData): Date => {
    return new Date(dateData.year, dateData.month - 1, dateData.day);
  };

  const getMarkedDates = () => {
    const markedDates: any = {};

    if (selectedStartDate) {
      if (selectedEndDate) {
        markedDates[selectedStartDate.dateString] = {
          selected: true,
          startingDay: true,
          color: "#4338ca",
        };
      } else {
        markedDates[selectedStartDate.dateString] = {
          selected: true,
          startingDay: true,
          endingDay: true,
          color: "#4338ca",
        };
      }
    }

    if (selectedEndDate) {
      if (selectedStartDate) {
        markedDates[selectedEndDate.dateString] = {
          selected: true,
          endingDay: true,
          color: "#4338ca",
        };
      } else {
        markedDates[selectedEndDate.dateString] = {
          selected: true,
          startingDay: true,
          endingDay: true,
          color: "#4338ca",
        };
      }
    }

    if (selectedStartDate && selectedEndDate) {
      const start = new Date(selectedStartDate.timestamp);
      const end = new Date(selectedEndDate.timestamp);

      const currentDate = new Date(start);
      currentDate.setDate(currentDate.getDate() + 2);

      while (currentDate <= end) {
        const dateString = formatDateToString(currentDate);
        markedDates[dateString] = {
          selected: true,
          color: "#6366f1",
        };
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return markedDates;
  };

  const handleDayPress = (date: DateData) => {
    if (selectedDate === "stardDate") {
      setSelectedStartDate(date);

      if (selectedEndDate && date.timestamp >= selectedEndDate.timestamp) {
        setSelectedEndDate(undefined);
      }

      setSelectedDate("endDate");
    } else {
      if (selectedStartDate && date.timestamp <= selectedStartDate.timestamp) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(date);
      } else {
        setSelectedEndDate(date);
        setSelectedDate("stardDate");
      }
    }
  };

  const handleApply = () => {
    onDatesChange({
      newStartDate: selectedStartDate
        ? dateDataToDate(selectedStartDate)
        : undefined,
      newEndDate: selectedEndDate ? dateDataToDate(selectedEndDate) : undefined,
    });
    setHide();
  };

  return (
    <DrawerBotton open={open} setHide={setHide} className="min-h-[70vh]">
      {/* Container principal */}
      <View className="flex-1 flex-col justify-between h-full">
        {/* Cabeçalho das datas */}
        <View className="flex-row items-center justify-around gap-2">
          {/* Start date */}
          <View
            className="form-date-container"
            style={
              selectedDate === "stardDate" && {
                borderColor: "#4f46e5",
              }
            }
          >
            <TouchableOpacity
              onPress={() => setSelectedDate("stardDate")}
              className="form-date-input"
            >
              <Text
                className="form-date-text"
                style={
                  selectedDate === "stardDate" && {
                    color: "#4f46e5",
                  }
                }
              >
                {selectedStartDate
                  ? selectedStartDate.dateString
                  : "Start date"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedStartDate(undefined)}>
              <AntDesign
                name="closecircle"
                size={24}
                color={selectedDate === "stardDate" ? "#4f46e5" : "#71717a"}
              />
            </TouchableOpacity>
          </View>
          {/* End date */}
          <View
            className="form-date-container"
            style={
              selectedDate === "endDate" && {
                borderColor: "#4f46e5",
              }
            }
          >
            <TouchableOpacity
              onPress={() => setSelectedDate("endDate")}
              className="form-date-input"
            >
              <Text
                className="form-date-text"
                style={
                  selectedDate === "endDate" && {
                    color: "#4f46e5",
                  }
                }
              >
                {selectedEndDate ? selectedEndDate.dateString : "End date"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedEndDate(undefined)}>
              <AntDesign
                name="closecircle"
                size={24}
                color={selectedDate === "endDate" ? "#4f46e5" : "#71717a"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Calendário */}
        <View className="flex-1">
          <Calendar
            style={styles.calendar}
            headerStyle={styles.headerCalendar}
            theme={{
              textMonthFontSize: 18,
              monthTextColor: "#818cf8",
              todayTextColor: "#4338ca",
              selectedDayTextColor: "#e4e4e7",
              arrowColor: "#818cf8",
              calendarBackground: "transparent",
            }}
            markingType={"period"}
            onDayPress={handleDayPress}
            markedDates={getMarkedDates()}
          />
        </View>
        {/* Botões para salvar e fechar */}
        <View className="flex-row items-center justify-around gap-2 mt-4">
          <TouchableOpacity
            onPress={setHide}
            className="flex-1 bg-zinc-800 border-2 border-zinc-600 rounded-xl p-2 items-center"
          >
            <Text className="text-zinc-200 text-xl">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleApply}
            className="flex-1 bg-indigo-800 border-2 border-indigo-600 rounded-xl p-2 items-center"
          >
            <Text className="text-zinc-200 text-xl">Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </DrawerBotton>
  );
}

const styles = StyleSheet.create({
  calendar: {
    backgroundColor: "transparent",
  },
  headerCalendar: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#52525b",
    paddingBottom: 10,
    marginBottom: 10,
  },
});
