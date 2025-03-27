import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

export function LoadStatePlugin({
  savedContent,
}: {
  savedContent: string | null;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (savedContent) {
      try {
        const initialEditorState = editor.parseEditorState(savedContent);
        editor.setEditorState(initialEditorState);
      } catch (error) {
        console.error("Failed to parse editor state:", error);
      }
    }
  }, [editor, savedContent]);

  return null;
}
