import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { taskStatus } from "@/constants/status";
import { Task } from "@/db/schemas/task";
import { formatStatusLabel } from "@/utils/formatTaskStatus";
import { StatusColor } from "@/utils/taskStatusColor";
import { List } from "./list";
import { CardTask } from "./cardTask";

interface StatusListProps {
  tasks: Task[];
  status: taskStatus;
}

export function StatusList({ tasks, status }: StatusListProps) {
  const [showTasks, setShowTasks] = useState(false);

  return (
    <View className="flex-1 my-2 p-2">
      {/* Header da tabela */}
      <TouchableOpacity
        onPress={() => setShowTasks(!showTasks)}
        className="flex-row items-center justify-start gap-4 py-2 px-4 mx-4 rounded-t-3xl w-1/2"
        style={{ backgroundColor: StatusColor(status) }}
      >
        <View>
          {showTasks ? (
            <AntDesign name="upcircle" size={24} color="white" />
          ) : (
            <AntDesign name="downcircle" size={24} color="white" />
          )}
        </View>
        <Text className="text-zinc-200 text-xl font-bold">
          {formatStatusLabel(status)} {tasks.length}
        </Text>
      </TouchableOpacity>

      {/* Tabela de tarefas */}
      <View className="flex-1 bg-slate-800 px-2 py-4 rounded-lg">
        {tasks.length === 0 ? (
          <View>
            <Text className="font-medium text-zinc-200 text-base text-center">
              There are no tasks in this status yet.
            </Text>
          </View>
        ) : (
          <List isOpen={showTasks} heigth={tasks.length}>
            <View className="gap-3">
              {tasks.map((task) => (
                <CardTask key={task.id} task={task} />
              ))}
            </View>
          </List>
        )}
      </View>
    </View>
  );
}
