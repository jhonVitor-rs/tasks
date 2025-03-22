import { eq } from "drizzle-orm";
import { useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { Text, TouchableOpacity, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { NewTask, Task, tasks } from "@/db/schemas/task";
import { formatStatusLabel } from "@/utils/formatTaskStatus";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { StatusColor } from "@/utils/taskStatusColor";
import { taskStatus } from "@/constants/status";
import { TaskEditor } from "./newTask";
import { StatusChange } from "./statusChange";
import { SubTaskTable } from "./subTaskTable";

interface RowTasks {
  task: Task;
}

export function RowTasks({ task }: RowTasks) {
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
      console.log(error);
    }
  };

  return (
    <View className="">
      <TouchableOpacity
        className="table-container-row py-2"
        onPress={() => setOpenFormEdit(true)}
      >
        <Text className="row-table header-table-width border-r border-zinc-900">
          {task.name}
        </Text>
        <Text className="row-table header-table-width border-r border-zinc-900">
          {task.startDate.toLocaleDateString()}
        </Text>
        <Text className="row-table header-table-width border-r border-zinc-900">
          {task.endDate
            ? task.endDate.toLocaleDateString()
            : task.startDate.toLocaleDateString()}
        </Text>
        <Text className="header-table-width border-r border-zinc-900">
          <TouchableOpacity
            onPress={() => setOpenStatusEditor(true)}
            className="py-2 px-3 rounded-md"
            style={{ backgroundColor: StatusColor(task.status as taskStatus) }}
          >
            <Text className="row-table">{formatStatusLabel(task.status)}</Text>
          </TouchableOpacity>
        </Text>
        <Text className="header-table-width">
          <TouchableOpacity
            className="bg-red-500 p-2 rounded-3xl"
            onPress={deleteTask}
          >
            <Feather name="trash-2" size={24} color="#27272a" />
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
