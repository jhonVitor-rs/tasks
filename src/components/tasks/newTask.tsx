import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewSubTask, SubTask } from "@/db/schemas/subtasks";
import { NewTask, Task } from "@/db/schemas/task";
import { DrawerBotton } from "../ui/drawerBotton";
import { taskStatus } from "@/constants/status";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import { DatePicker } from "./datePicker";
import { formatStatusLabel } from "@/utils/formatTaskStatus";
import { StatusColor } from "@/utils/taskStatusColor";
import { StatusChange } from "./statusChange";

interface TaskEditorProps {
  open: boolean;
  setHide: () => void;
  task?: Task | SubTask;
  onSave: (task: NewTask | NewSubTask) => void;
}

const taskForm = z.object({
  name: z
    .string()
    .min(3, "The name must have at least 3 characters")
    .max(50, "The name must have a maximum of 50 characters"),
  body: z.string(),
  status: z.enum(Object.values(taskStatus) as [string, ...string[]]),
  startDate: z.date(),
  endDate: z.date().optional(),
});

export function TaskEditor({ open, setHide, task, onSave }: TaskEditorProps) {
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const hideDatePicker = () => setOpenDatePicker(false);

  const [openStatusPicker, setOpenStatusPicker] = useState(false);
  const hideStatusPicker = () => setOpenStatusPicker(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<z.infer<typeof taskForm>>({
    resolver: zodResolver(taskForm),
    defaultValues: {
      name: task?.name || "Untitled Task",
      body: task?.body || "",
      status: task?.status || taskStatus.TO_DO,
      startDate: task?.startDate || undefined,
      endDate: task?.endDate || undefined,
    },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const status = watch("status") as taskStatus;

  const onDatesChange = ({
    newStartDate,
    newEndDate,
  }: {
    newStartDate?: Date;
    newEndDate?: Date;
  }) => {
    if (newStartDate)
      setValue("startDate", newStartDate, { shouldValidate: true });
    if (newEndDate) setValue("endDate", newEndDate, { shouldValidate: true });
  };

  const onStatusChange = (s: taskStatus) => {
    setValue("status", s, { shouldValidate: true });
  };

  const onSubmit = handleSubmit((data) => {
    onSave({
      taskId: (task as SubTask)?.taskId || "",
      name: data.name,
      body: data.body,
      status,
      startDate,
      endDate,
    });
  });

  return (
    <DrawerBotton open={open} setHide={setHide}>
      <View className="p-4">
        <Text className="text-2xl font-bold mb-5 text-zinc-200">
          {task ? "Edit Task" : "Create Task"}
        </Text>

        {/* Name */}
        <View className="form-field">
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="form-text-input border-b-2 text-xl font-semibold text-slate-500"
                placeholder="Untitled Task"
                focusable
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.name && (
            <Text className="form-input-error">{errors.name.message}</Text>
          )}
        </View>

        {/* Body */}
        <View className="form-field">
          <Controller
            control={control}
            name="body"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="form-text-input border-b text-lg text-slate-500 bg-slate-800 rounded-t-xl"
                placeholder="Tap to add a description..."
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                multiline
                numberOfLines={4}
              />
            )}
          />
          {errors.body && (
            <Text className="form-input-error">{errors.body.message}</Text>
          )}
        </View>

        {/* Date Picker */}
        <View className="form-field">
          <TouchableOpacity
            onPress={() => setOpenDatePicker(true)}
            className="flex-row items-center gap-4 p-2 rounded-lg bg-slate-800"
          >
            <FontAwesome5 name="calendar-day" size={24} color="white" />
            <Text className="text-zinc-200 font-medium text-lg">
              {!startDate && !endDate
                ? "Set dates"
                : `${startDate ? startDate.toLocaleDateString() : ""}${
                    startDate && endDate ? " - " : ""
                  }${endDate ? endDate.toLocaleDateString() : ""}`}
            </Text>
            {errors.startDate && (
              <Text className="form-input-error">
                {errors.startDate.message}
              </Text>
            )}
            {errors.endDate && (
              <Text className="form-input-error">{errors.endDate.message}</Text>
            )}
          </TouchableOpacity>
          <DatePicker
            open={openDatePicker}
            setHide={hideDatePicker}
            startDate={startDate}
            endDate={endDate}
            onDatesChange={onDatesChange}
          />
        </View>

        {/* Status change */}
        <View className="form-field">
          <TouchableOpacity
            onPress={() => setOpenStatusPicker(true)}
            className="flex-row items-center p-2 rounded-lg border-2 border-slate-600"
            style={{ backgroundColor: StatusColor(status) }}
          >
            <Text className="text-zinc-200 text-xl font-semibold">
              {formatStatusLabel(status)}
            </Text>
          </TouchableOpacity>
          {errors.status && (
            <Text className="form-input-error">{errors.status.message}</Text>
          )}
          <StatusChange
            open={openStatusPicker}
            setHide={hideStatusPicker}
            status={status}
            onStatusChange={onStatusChange}
          />
        </View>

        <View className="flex-row items-center justify-around gap-2 mt-4">
          <TouchableOpacity
            onPress={setHide}
            className="flex-1 bg-slate-800 border-2 border-slate-600 rounded-xl p-2 items-center"
          >
            <Text className="text-zinc-200 text-xl">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSubmit}
            className="flex-1 bg-indigo-800 border-2 border-indigo-600 rounded-xl p-2 items-center"
          >
            <Text className="text-zinc-200 text-xl">Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </DrawerBotton>
  );
}
