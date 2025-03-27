import { Note, notes } from "@/db/schemas/notes";
import { cn } from "@/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Animated,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

const inputForm = z.object({
  title: z
    .string()
    .min(3, "The title must have at least 3 characters")
    .max(50, "The title must have a maximum of 50 characters"),
});

interface CreateNoteProps {
  open: boolean;
  setHide: () => void;
}

export function CreateNote({ open, setHide }: CreateNoteProps) {
  const router = useRouter();
  const expoDB = useSQLiteContext();
  const db = drizzle(expoDB);

  const opacityAnim = useRef(new Animated.Value(0)).current;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<z.infer<typeof inputForm>>({
    resolver: zodResolver(inputForm),
    defaultValues: {
      title: "",
    },
  });

  const onSave = handleSubmit(async (data) => {
    try {
      const [newNote] = await db
        .insert(notes)
        .values({
          title: data.title,
        })
        .returning();

      router.navigate(`../note/${newNote.id}`);
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: open ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [open]);

  return (
    <Modal
      transparent
      visible={open}
      animationType="fade"
      onRequestClose={setHide}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
        activeOpacity={1}
        onPress={setHide}
      >
        <Animated.View
          className={cn(
            "absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-slate-900 rounded-lg border border-slate-600",
            `opacity-${opacityAnim}`
          )}
        >
          <View className="flex-1 p-4 w-80">
            <Text className="text-2xl font-bold mb-5 text-zinc-200">
              Add new note
            </Text>

            <View className="form-field">
              <Controller
                control={control}
                name="title"
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
              {errors.title && (
                <Text className="form-input-error">{errors.title.message}</Text>
              )}
            </View>

            <View className="flex-row items-center justify-around gap-2 mt-4">
              <TouchableOpacity
                onPress={setHide}
                className="flex-1 bg-slate-800 border-2 border-slate-600 rounded-xl p-2 items-center"
              >
                <Text className="text-zinc-200 text-xl">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onSave}
                className="flex-1 bg-indigo-800 border-2 border-indigo-600 rounded-xl p-2 items-center"
              >
                <Text className="text-zinc-200 text-xl">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}
