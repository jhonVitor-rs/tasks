import { Text, TouchableOpacity, View } from "react-native";
import { DrawerBotton } from "../ui/drawerBotton";
import { taskStatus } from "@/constants/status";
import { formatStatusLabel } from "@/utils/formatTaskStatus";
import { StatusColor } from "@/utils/taskStatusColor";
import { useState } from "react";

interface StatusChangeProps {
  open: boolean;
  setHide: () => void;
  status?: taskStatus;
  onStatusChange: (status: taskStatus) => void;
}

export function StatusChange({
  open,
  setHide,
  status = taskStatus.TO_DO,
  onStatusChange,
}: StatusChangeProps) {
  const [selectedStatus, setSelectedStatus] = useState(status);

  const handleStatus = () => {
    onStatusChange(selectedStatus);
    setHide();
  };

  return (
    <DrawerBotton open={open} setHide={setHide}>
      <View className="flex flex-1 flex-col gap-6">
        <View className="flex flex-1 flex-col gap-4">
          {Object.keys(taskStatus).map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => setSelectedStatus(s as taskStatus)}
              className="flex-1 p-2 rounded-md border-2"
              style={[
                selectedStatus === s && {
                  backgroundColor: StatusColor(s),
                  borderColor: "#52525b",
                },
                selectedStatus !== s && {
                  backgroundColor: "#27272a",
                  borderBlockColor: "#52525b",
                  borderRightColor: "#52525b",
                  borderLeftWidth: 5,
                  borderLeftColor: StatusColor(s as taskStatus),
                },
              ]}
            >
              <Text className="text-zinc-200 text-lg font-semibold">
                {formatStatusLabel(s)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-row items-center justify-around gap-2 mt-4">
          <TouchableOpacity
            onPress={setHide}
            className="flex-1 bg-zinc-800 border-2 border-zinc-600 rounded-xl p-2 items-center"
          >
            <Text className="text-zinc-200 text-xl">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleStatus}
            className="flex-1 bg-indigo-800 border-2 border-indigo-600 rounded-xl p-2 items-center"
          >
            <Text className="text-zinc-200 text-xl">Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </DrawerBotton>
  );
}
