"use dom";

import "../../app/global.css";
import { $getRoot } from "lexical";
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
  setPlainText,
  setEditorState,
  keyboardHeigth,
}: {
  setPlainText: React.Dispatch<React.SetStateAction<string>>;
  setEditorState: React.Dispatch<React.SetStateAction<string | null>>;
  keyboardHeigth: number;
}) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="flex flex-col min-h-[90vh] w-full">
        <div className="flex-1 overflow-auto">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="border-none p-3 m-1 rounded h-full outline-none text-zinc-200"
                autoFocus
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin
            onChange={(editorState, editor, tags) => {
              editorState.read(() => {
                const root = $getRoot();
                const textContent = root.getTextContent();
                setPlainText(textContent);
              });
              setEditorState(JSON.stringify(editorState.toJSON()));
            }}
            ignoreHistoryMergeTagChange
            ignoreSelectionChange
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
