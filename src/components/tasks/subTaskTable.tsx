import { SubTask } from "@/db/schemas/subtasks";
import { Text, View } from "react-native";

interface SubTaskTableProps {
  subTasks: SubTask[];
}

export function SubTaskTable({ subTasks }: SubTaskTableProps) {
  return (
    <View className="flex-1 border-t-2 border-zinc-600">
      <View className="table-container-row bg-red-500">
        <Text className="header-table border-r border-zinc-900"></Text>
        <Text className="header-table border-r border-zinc-900">Name</Text>
        <Text className="header-table header-table-width border-r border-zinc-900">
          Started date
        </Text>
        <Text className="header-table header-table-width border-r border-zinc-900">
          End date
        </Text>
        <Text className="header-table header-table-width border-r border-zinc-900">
          Status
        </Text>
        <Text className="header-table header-table-width">Actions</Text>
      </View>
    </View>
  );
}
