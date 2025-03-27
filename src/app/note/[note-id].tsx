import { useEffect, useState } from "react";
import { Keyboard, Platform, Text, View } from "react-native";
import RichEditor from "@/components/notes/richEditor";
import { Stack } from "expo-router";

export default function Note() {
  const [editorState, setEditorState] = useState<string | null>(null);
  const [plainText, setPlainText] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

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

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

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
