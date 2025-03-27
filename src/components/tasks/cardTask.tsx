import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { taskStatus } from "@/constants/status";
import { NewTask, Task, tasks } from "@/db/schemas/task";
import { StatusColor } from "@/utils/taskStatusColor";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { TaskEditor } from "./newTask";
import { StatusChange } from "./statusChange";
import { cn } from "@/utils/cn";

interface CardTaskProps {
  task: Task;
  className?: string;
}

export function CardTask({ task, className }: CardTaskProps) {
  const expoDB = useSQLiteContext();
  const db = drizzle(expoDB);

  const [openFormEdit, setOpenFormEdit] = useState(false);
  const hideFormEdit = () => setOpenFormEdit(false);

  const saveTask = async (newTask: NewTask) => {
    try {
      await db
        .update(tasks)
        .set({
          name: newTask.name,
          body: newTask.body,
          status: newTask.status,
          startDate: newTask.startDate,
          endDate: newTask.endDate,
          updatedAt: new Date(),
        })
        .where(eq(tasks.id, task.id));
      hideFormEdit();
    } catch (error) {
      console.error();
    }
  };

  const [openStatusEditor, setOpenStatusEditor] = useState(false);
  const hideStatusEditor = () => setOpenStatusEditor(false);

  const handleStatus = async (newStatus: taskStatus) => {
    try {
      await saveTask({ ...task, status: newStatus });
      hideStatusEditor();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async () => {
    try {
      await db.delete(tasks).where(eq(tasks.id, task.id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className={cn(className)}>
      <TouchableOpacity
        className="flex-row items-center bg-slate-900 px-4 py-2 rounded-3xl justify-between gap-4"
        onPress={() => setOpenFormEdit(true)}
      >
        <Text className="row-table text-xl">{task.name}</Text>
        <Text className="row-table text-lg">
          {task.startDate.toLocaleDateString()}
        </Text>
        <Text>
          <TouchableOpacity
            onPress={() => setOpenStatusEditor(true)}
            className="p-1 rounded-3xl"
            style={{ backgroundColor: StatusColor(task.status as taskStatus) }}
          >
            {StatusIcon(task.status as taskStatus)}
          </TouchableOpacity>
        </Text>
        <Text className="">
          <TouchableOpacity
            className="bg-red-500 p-1 rounded-3xl"
            onPress={deleteTask}
          >
            <Feather name="trash-2" size={22} color="#27272a" />
          </TouchableOpacity>
        </Text>
      </TouchableOpacity>

      {/* Modais */}
      {/* Modal de edição */}
      <TaskEditor
        task={task}
        open={openFormEdit}
        setHide={hideFormEdit}
        onSave={saveTask}
      />

      {/* MOdal de status */}
      <StatusChange
        status={task.status as taskStatus}
        open={openStatusEditor}
        setHide={hideStatusEditor}
        onStatusChange={handleStatus}
      />
    </View>
  );
}

function StatusIcon(status: taskStatus) {
  switch (status) {
    case taskStatus.TO_DO:
      return <MaterialIcons name="work-outline" size={22} color="#e4e4e7" />;
    case taskStatus.IN_PROGRESS:
      return <Entypo name="progress-two" size={22} color="#e4e4e7" />;
    case taskStatus.PAUSED:
      return <AntDesign name="pausecircleo" size={22} color="#e4e4e7" />;
    case taskStatus.COMPLETED:
      return <MaterialIcons name="task-alt" size={22} color="#e4e4e7" />;
    case taskStatus.CANCELED:
    default:
      return <MaterialIcons name="cancel" size={22} color="#e4e4e7" />;
  }
}
