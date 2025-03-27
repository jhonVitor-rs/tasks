"use dom";

import "../../app/global.css";
import { $getRoot, EditorState } from "lexical";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";

import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode } from "@lexical/code";
import { QuoteNode } from "@lexical/rich-text";
import { ToolbarPlugin } from "./toolbarPlugin";
import theme from "./theme";
import { LoadStatePlugin } from "@/hooks/serializedEditorContent";
import { Note } from "@/db/schemas/notes";
import { useState } from "react";

const placeholder = "Enter some rich text...";

const editorConfig = {
  namespace: "React.js Demo",
  nodes: [ListNode, ListItemNode, CodeNode, QuoteNode],
  onError(error: Error) {
    throw error;
  },
  theme,
};
export default function Editor({
  initialContent,
  keyboardHeigth,
  setEditorStateRoot,
  onSave,
}: {
  initialContent: string | null;
  keyboardHeigth: number;
  setEditorStateRoot: (state: string) => void;
  onSave: (note: Partial<Note>) => Promise<null | Partial<Note>>;
}) {
  const [editorState, setEditorState] = useState<string | null>(initialContent);

  const handleSave = async () => {
    try {
      await onSave({ content: editorState });
    } catch (error) {
      console.error("Error saving content:", error);
    }
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <LoadStatePlugin savedContent={initialContent} />
      <div className="flex flex-col min-h-[90vh] w-full">
        <div className="flex-1 overflow-auto">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="border-none p-3 m-1 rounded h-full outline-none text-zinc-200"
                onBlur={() => handleSave()}
                autoFocus
              />
            }
            placeholder={
              <div className="pointer-events-none absolute top-[1.125rem] left-[1.125rem] text-zinc-500">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin
            onChange={(editorState) => {
              editorState.read(() => {
                const content = JSON.stringify(editorState.toJSON());
                setEditorState(content);
                setEditorStateRoot(content);
              });
            }}
          />
          <ListPlugin />
          <HistoryPlugin />
          <AutoFocusPlugin />
        </div>
        <div
          className="absolute left-0 w-full border-t border-slate-500 bg-slate-700"
          style={{
            bottom: keyboardHeigth,
            transition: "bottom 0.3s ease",
          }}
        >
          <ToolbarPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}
