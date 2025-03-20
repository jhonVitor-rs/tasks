import { StatusList } from "@/components/tasks/statusList";
import Header, { Title } from "@/components/ui/header";
import { taskStatus } from "@/constants/status";
import { subTasks, SubTask } from "@/db/schemas/subtasks";
import { tasks, Task } from "@/db/schemas/task";
import { eq } from "drizzle-orm";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useEventListener } from "expo";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

interface TaskWithSubTasks extends Task {
  subTasks: SubTask[];
}

type TasksByStatus = Record<taskStatus, TaskWithSubTasks[]>;

export default function Tasks() {
  const expoDB = useSQLiteContext();
  const db = drizzle(expoDB);

  const [taskByStatus, setTaskByStatus] = useState<TasksByStatus>(() => {
    return Object.keys(taskStatus).reduce((acc: TasksByStatus, status) => {
      acc[status as taskStatus] = [] as TaskWithSubTasks[];
      return acc;
    }, {} as TasksByStatus);
  });

  const { data: tasksData } = useLiveQuery(db.select().from(tasks));
  const { data: subTasksData } = useLiveQuery(db.select().from(subTasks));

  useEffect(() => {
    if (!tasksData || !subTasksData) return;

    const subTaskByTaskId = subTasksData.reduce((acc, subTask) => {
      if (!acc[subTask.taskId]) {
        acc[subTask.taskId] = [];
      }
      acc[subTask.taskId].push(subTask);
      return acc;
    }, {} as Record<string, SubTask[]>);

    const tasksWithSubTasks = tasksData.map((task) => ({
      ...task,
      subTasks: subTaskByTaskId[task.id] || [],
    }));

    const newTasksByStatus = Object.keys(taskStatus).reduce((acc, status) => {
      acc[status as taskStatus] = tasksWithSubTasks.filter(
        (task) => task.status === status
      );
      return acc;
    }, {} as TasksByStatus);
    setTaskByStatus(newTasksByStatus);
  }, [tasksData, subTasksData]);

  return (
    <View className="flex flex-col w-full min-h-screen bg-zinc-700 pb-36">
      <Header>
        <Title title="Tasks" />
      </Header>
      <ScrollView className="py-4">
        {Object.keys(taskStatus).map((status) => (
          <StatusList
            key={status}
            status={status as taskStatus}
            tasks={taskByStatus[status as taskStatus]}
          />
        ))}
      </ScrollView>
    </View>
  );
}
