import { useCallback, useEffect, useState } from "react";
import { Keyboard, Platform, Text, View } from "react-native";
import RichEditor from "@/components/notes/richEditor";
import { Stack, useFocusEffect, useGlobalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { Note, notes } from "@/db/schemas/notes";
import { eq } from "drizzle-orm";
import { HeaderNote } from "@/components/notes/header";

export default function NoteEditor() {
  const expoDB = useSQLiteContext();
  const db = drizzle(expoDB);
  const { "note-id": noteId } = useGlobalSearchParams<{ "note-id": string }>();

  const [note, setNote] = useState<Note>();
  const [title, setTitle] = useState("");
  const handleTitle = (t: string) => setTitle(t);
  const [editorState, setEditorState] = useState<string | null>(null);
  const handleEditorState = (state: string) => setEditorState(state);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const fetchNote = async () => {
    const [fetchedNote] = await db
      .select()
      .from(notes)
      .where(eq(notes.id, noteId))
      .limit(1);

    if (fetchedNote) {
      setNote(fetchedNote);
      setTitle(fetchedNote.title);
      setEditorState(fetchedNote.content);
    }
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
  }, [noteId]);

  const onSave = async (noteUpdated: Partial<Note>) => {
    if (!noteId) {
      console.error("Note ID is required for update");
      return null;
    }

    try {
      await db
        .update(notes)
        .set({
          ...noteUpdated,
          updatedAt: new Date(),
        })
        .where(eq(notes.id, noteId));

      return noteUpdated;
    } catch (error) {
      console.error("Error updating note:", error);
      return null;
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        onSave({ content: editorState, title });
      };
    }, [noteId, editorState, title])
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="relative flex flex-col w-full min-h-screen bg-slate-600">
        <HeaderNote
          noteTitle={note?.title || ""}
          onSave={onSave}
          setTitleRoot={handleTitle}
        />
        <RichEditor
          initialContent={note?.content || null}
          setEditorStateRoot={handleEditorState}
          keyboardHeigth={keyboardHeight}
          onSave={onSave}
        />
      </View>
    </>
  );
}
