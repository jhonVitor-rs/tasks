import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $insertNodes } from "lexical";
import { useState } from "react";
import {
  $createListItemNode,
  $createListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListType,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { cn } from "@/utils/cn";

interface ToggleListsProps {
  blockType: string;
}

export function ToggleLists({ blockType }: ToggleListsProps) {
  const [editor] = useLexicalComposerContext();

  return (
    <>
      <button
        className={cn("toolbar-button bg-slate-800")}
        onClick={() => {
          if (blockType !== "ol") {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          }
        }}
      >
        <FontAwesome name="list-ol" size={24} color="#e4e4e7" />
      </button>
      <button
        className={cn("toolbar-button bg-slate-800")}
        onClick={() => {
          if (blockType === "ul") {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          }
        }}
      >
        <FontAwesome name="list-ul" size={24} color="#e4e4e7" />
      </button>
    </>
  );
}
