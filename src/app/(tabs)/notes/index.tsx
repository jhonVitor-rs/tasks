import { CreateNote } from "@/components/notes/createNote";
import { ListNotes } from "@/components/notes/listNotes";
import { RecentNotes } from "@/components/notes/recentNotes";
import Header, { Title } from "@/components/ui/header";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Notes() {
  const [openNewNoteForm, setOpenNewNoteForm] = useState(false);
  const hideForm = () => setOpenNewNoteForm(false);

  return (
    <View className="relative flex flex-col w-full min-h-screen bg-slate-700">
      <Header>
        <Title title="Notes" />
      </Header>
      <RecentNotes />
      <ListNotes />
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
