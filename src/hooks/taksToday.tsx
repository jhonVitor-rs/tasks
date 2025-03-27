import { taskStatus } from "@/constants/status";
import { NewTask, Task, tasks } from "@/db/schemas/task";
import { formatDateToString } from "@/utils/formatDate";
import { StatusColor } from "@/utils/taskStatusColor";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { year } from "drizzle-orm/mysql-core";
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
  const [openNewTaskForm, setOpenNewTaskForm] = useState(false);
  const hideForm = () => setOpenNewTaskForm(false);

  const expoDB = useSQLiteContext();
  const db = drizzle(expoDB);

  const { data } = useLiveQuery(db.select().from(tasks).orderBy(tasks.status));

  const isTaskOnDay = (task: Task, selectedDay: DateData) => {
    const taskStart =
      task.startDate instanceof Date
        ? task.startDate
        : new Date(task.startDate);

    const taskStartDate = {
      day: taskStart.getDate(),
      month: taskStart.getMonth() + 1,
      year: taskStart.getFullYear(),
    };

    if (!task.endDate) {
      return (
        taskStartDate.day === selectedDay.day &&
        taskStartDate.month === selectedDay.month &&
        taskStartDate.year === selectedDay.year
      );
    }

    const taskEnd =
      task.endDate instanceof Date ? task.endDate : new Date(task.endDate);

    const taskEndDate = {
      day: taskEnd.getDate(),
      month: taskEnd.getMonth() + 1,
      year: taskEnd.getFullYear(),
    };

    return (
      taskStartDate.year <= selectedDay.year &&
      taskEndDate.year >= selectedDay.year &&
      taskStartDate.month <= selectedDay.month &&
      taskEndDate.month >= selectedDay.month &&
      taskStartDate.day <= selectedDay.day &&
      taskEndDate.day >= selectedDay.day
    );
  };

  useEffect(() => {
    setTasksDay(() => data.filter((task) => isTaskOnDay(task, selectedDay)));
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
        start.setDate(start.getDate() + 1);
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
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

  const createTask = async (newTask: NewTask) => {
    try {
      await db.insert(tasks).values({
        name: newTask.name,
        body: newTask.body,
        status: newTask.status,
        startDate: newTask.startDate,
        endDate: newTask.endDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      hideForm();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    keyForm: data.length,
    tasksDay,
    setSelectedDay,
    getMarkedDates,
    openNewTaskForm,
    setOpenNewTaskForm,
    hideForm,
    createTask,
  };
}
