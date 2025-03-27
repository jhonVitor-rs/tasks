import { CreateNote } from "@/components/notes/createNote";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Notes() {
  const router = useRouter();
  const [openNewNoteForm, setOpenNewNoteForm] = useState(false);
  const hideForm = () => setOpenNewNoteForm(false);

  return (
    <View className="relative flex flex-col w-full min-h-screen bg-slate-700">
      <Text>Notes</Text>
      <TouchableOpacity onPress={() => router.navigate("../note/123")}>
        <Text>Navegar para a nota</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="absolute right-8 top-[80vh] flex items-center justify-center bg-indigo-500 p-4 rounded-full"
        onPress={() => setOpenNewNoteForm(true)}
      >
        <MaterialIcons name="note-add" size={28} color="white" />
      </TouchableOpacity>
      <CreateNote open={openNewNoteForm} setHide={hideForm} />
    </View>
  );
}
