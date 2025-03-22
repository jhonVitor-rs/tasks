import { TaskEditor } from "@/components/tasks/newTask";
import { StatusList } from "@/components/tasks/statusList";
import Header, { Title } from "@/components/ui/header";
import { taskStatus } from "@/constants/status";
import { tasks, Task, NewTask } from "@/db/schemas/task";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type TasksByStatus = Record<taskStatus, Task[]>;

export default function Tasks() {
  const expoDB = useSQLiteContext();
  const db = drizzle(expoDB);

  const [openNewTaskForm, setOpenNewTaskForm] = useState(false);
  const hideForm = () => setOpenNewTaskForm(false);

  const [taskByStatus, setTaskByStatus] = useState<TasksByStatus>(() => {
    return Object.keys(taskStatus).reduce((acc: TasksByStatus, status) => {
      acc[status as taskStatus] = [] as Task[];
      return acc;
    }, {} as TasksByStatus);
  });

  const { data } = useLiveQuery(db.select().from(tasks));

  useEffect(() => {
    if (!data) return;

    const newTasksByStatus = Object.keys(taskStatus).reduce((acc, status) => {
      acc[status as taskStatus] = data.filter((task) => task.status === status);
      return acc;
    }, {} as TasksByStatus);
    setTaskByStatus(newTasksByStatus);
  }, [data]);

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

  return (
    <View className="relative flex flex-col w-full min-h-screen bg-slate-700 pb-36">
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
      <TouchableOpacity
        className="absolute right-8 top-[80vh] flex items-center justify-center bg-indigo-500 p-4 rounded-full"
        onPress={() => setOpenNewTaskForm(true)}
      >
        <MaterialIcons name="add-task" size={28} color="white" />
      </TouchableOpacity>
      <TaskEditor
        key={data.length}
        open={openNewTaskForm}
        setHide={hideForm}
        onSave={createTask}
      />
    </View>
  );
}
