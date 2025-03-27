import { useEffect, useState } from "react";
import { Keyboard, Platform, Text, View } from "react-native";
import RichEditor from "@/components/notes/richEditor";
import { Stack, useGlobalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { Note, notes } from "@/db/schemas/notes";
import { eq } from "drizzle-orm";

export default function NoteEditor() {
  const expoDB = useSQLiteContext();
  const db = drizzle(expoDB);
  const { "note-id": noteId } = useGlobalSearchParams<{ "note-id": string }>();

  const [title, setTitle] = useState("");
  const [editorState, setEditorState] = useState<string | null>(null);
  const [plainText, setPlainText] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const fetchNote = async () => {
    const [note] = await db
      .select()
      .from(notes)
      .where(eq(notes.id, noteId))
      .limit(1);
    setTitle(note.title);
    setEditorState(note.content);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    fetchNote();

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const onSave = (note: Note) => {
    db;
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="relative flex flex-col w-full min-h-screen bg-slate-600">
        <RichEditor
          setPlainText={setPlainText}
          setEditorState={setEditorState}
          keyboardHeigth={keyboardHeight}
        />
      </View>
    </>
  );
}
