import { taskStatus } from "@/constants/status";
import { Task, tasks } from "@/db/schemas/task";
import { formatDateToString } from "@/utils/formatDate";
import { StatusColor } from "@/utils/taskStatusColor";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import { DateData } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";

interface TasksTodayProps {
  date: Date;
}

export function TasksToday({ date }: TasksTodayProps) {
  const [selectedDay, setSelectedDay] = useState<DateData>({
    dateString: formatDateToString(date),
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    timestamp: date.getTime(),
  });

  const [tasksDay, setTasksDay] = useState<Task[]>();

  const expoDB = useSQLiteContext();
  const db = drizzle(expoDB);

  const { data } = useLiveQuery(db.select().from(tasks).orderBy(tasks.status));

  useEffect(() => {
    setTasksDay(() => {
      return data.filter((task) => {
        const taskStartTimestamp =
          task.startDate instanceof Date
            ? task.startDate.getTime()
            : task.startDate;

        const selectedDayMidnight = () => {
          const d = new Date(selectedDay.dateString);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        };

        if (!task.endDate) {
          return taskStartTimestamp === selectedDayMidnight();
        }

        const taskEndTimestamp =
          task.endDate instanceof Date ? task.endDate.getTime() : task.endDate;

        return (
          taskStartTimestamp <= selectedDayMidnight() &&
          selectedDayMidnight() <= taskEndTimestamp
        );
      });
    });
  }, [data, selectedDay]);

  const genMarkedPeriods = useCallback(() => {
    const markedDates: MarkedDates = {};

    if (!data || !Array.isArray(data)) return markedDates;

    data.forEach((task) => {
      const startDate =
        task.startDate instanceof Date
          ? formatDateToString(task.startDate)
          : task.startDate;

      if (!task.endDate) {
        if (!markedDates[startDate]) {
          markedDates[startDate] = {
            marked: true,
            periods: [],
          };
        }

        markedDates[startDate].periods = [
          ...(markedDates[startDate].periods || []),
          {
            startingDay: true,
            endingDay: true,
            color: StatusColor(task.status as taskStatus),
          },
        ];
      } else {
        const endDate =
          task.endDate instanceof Date
            ? formatDateToString(task.endDate)
            : task.endDate;

        const start = new Date(startDate);
        const end = new Date(endDate);
        const currentDay = new Date(start);

        const periodColor = StatusColor(task.status as taskStatus);

        while (currentDay <= end) {
          const dateString = formatDateToString(currentDay);
          const isStartDay = formatDateToString(currentDay) === startDate;
          const isEndDay = formatDateToString(currentDay) === endDate;

          if (!markedDates[dateString]) {
            markedDates[dateString] = {
              marked: true,
              periods: [],
            };
          }
          markedDates[dateString].periods = [
            ...(markedDates[dateString].periods || []),
            {
              startingDay: isStartDay,
              endingDay: isEndDay,
              color: periodColor,
            },
          ];

          currentDay.setDate(currentDay.getDate() + 1);
        }
      }
    });
    return markedDates;
  }, [data]);

  const getMarkedDates = () => {
    const markedDates = genMarkedPeriods();

    markedDates[selectedDay.dateString] = {
      ...markedDates[selectedDay.dateString],
      selected: true,
      color: "#4338ca",
    };

    return markedDates;
  };

  return {
    tasksDay,
    setSelectedDay,
    getMarkedDates,
  };
}
