import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { taskStatus } from "@/constants/status";
import { Task } from "@/db/schemas/task";
import { formatStatusLabel } from "@/utils/formatTaskStatus";
import { StatusColor } from "@/utils/taskStatusColor";
import { RowTasks } from "./rowTasks";

interface StatusListProps {
  tasks: Task[];
  status: taskStatus;
}

export function StatusList({ tasks, status }: StatusListProps) {
  const [showTasks, setShowTasks] = useState(false);

  return (
    <View className="flex-1 my-2">
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
      <View className="flex-1 border-t-2 border-b-2 border-slate-900">
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <View>
            {/* Cabeçalho das tarefas */}
            <View className="table-container-row bg-slate-800">
              <Text className="header-table header-table-width border-r border-slate-900">
                Name
              </Text>
              <Text className="header-table header-table-width border-r border-slate-900">
                Started date
              </Text>
              <Text className="header-table header-table-width border-r border-slate-900">
                End date
              </Text>
              <Text className="header-table header-table-width border-r border-slate-900">
                Status
              </Text>
              <Text className="header-table header-table-width">Actions</Text>
            </View>

            {/* Corpo da tabela */}
            {showTasks &&
              tasks.map((task) => <RowTasks task={task} key={task.id} />)}
          </View>
        </ScrollView>
        {tasks.length === 0 && (
          <View className="p-2">
            <Text className="font-medium text-zinc-200 text-base text-center">
              There are no tasks in this status yet.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
