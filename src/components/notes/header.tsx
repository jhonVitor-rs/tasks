import { drizzle } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Note } from "@/db/schemas/notes";

const inputForm = z.object({
  title: z
    .string()
    .min(3, "The title must have at least 3 characters")
    .max(50, "The title must have a maximum of 50 characters"),
});

interface HeaderNoteProps {
  noteTitle: string;
  setTitleRoot: (title: string) => void;
  onSave: (note: Partial<Note>) => Promise<null | Partial<Note>>;
}

export function HeaderNote({
  noteTitle,
  setTitleRoot,
  onSave,
}: HeaderNoteProps) {
  const router = useRouter();
  const [title, setTitle] = useState(noteTitle);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(noteTitle);
  }, [noteTitle]);

  const handleBlur = async () => {
    try {
      inputForm.parse({ title }).title;
      if (title !== noteTitle) {
        await onSave({ title });
      }
      setError(null);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      } else {
        setError("Erro ao salvar o título");
      }
    }
  };

  return (
    <View className="flex flex-col">
      <View className="flex flex-row h-[10vh] items-center p-4 gap-4">
        <TouchableOpacity onPress={() => router.dismiss()}>
          <Ionicons name="chevron-back" size={24} color="#e4e4e7" />
        </TouchableOpacity>

        <TextInput
          value={title}
          onChangeText={(e) => {
            setTitle(e);
            setTitleRoot(e);
          }}
          onBlur={handleBlur}
          placeholder="Título da nota"
          className={`flex-1 text-zinc-200 font-semibold text-2xl ${
            error ? "border-red-500" : "border-transparent"
          }`}
          placeholderTextColor="#71717a"
        />
      </View>

      {error && <Text className="text-red-500 px-4 pb-2">{error}</Text>}
    </View>
  );
}
