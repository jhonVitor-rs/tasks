import { cn } from "@/utils/cn";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  TextFormatType,
} from "lexical";
import { useState } from "react";

interface TextStyleProps {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
}

export function TextStyle({
  isBold,
  isItalic,
  isStrikethrough,
  isUnderline,
}: TextStyleProps) {
  const [editor] = useLexicalComposerContext();
  const [visibleTextStyleEditor, setVisibleTextStyleEditor] = useState(false);

  const applyTextStyle = (payload: TextFormatType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (selection.isCollapsed()) {
          selection.insertNodes([$createTextNode("\uFEFF")]);
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, payload);
        } else {
          selection.formatText(payload);
        }
      }
    });
  };

  return (
    <>
      <button
        className={cn(
          "toolbar-button",
          visibleTextStyleEditor ? "bg-slate-900" : "bg-slate-800"
        )}
        onClick={() => {
          setVisibleTextStyleEditor(!visibleTextStyleEditor), editor.focus();
        }}
      >
        <MaterialCommunityIcons name="format-text" size={24} color="#e4e4e7" />
      </button>

      <div
        className={cn(
          "absolute toolbar rounded-md border top-[-60px] left-1/2 transform -translate-x-1/2",
          visibleTextStyleEditor ? "opacity-100 block" : "opacity-0 hidden"
        )}
        style={{ transition: "opacity 0.4s ease" }}
      >
        <button
          className={cn(
            "toolbar-button",
            isBold ? "bg-slate-900" : "bg-slate-800"
          )}
          onClick={() => applyTextStyle("bold")}
        >
          <MaterialIcons name="format-bold" size={24} color="#e4e4e7" />
        </button>
        <button
          className={cn(
            "toolbar-button",
            isItalic ? "bg-slate-900" : "bg-slate-800"
          )}
          onClick={() => applyTextStyle("italic")}
        >
          <MaterialIcons name="format-italic" size={24} color="#e4e4e7" />
        </button>
        <button
          className={cn(
            "toolbar-button",
            isUnderline ? "bg-slate-900" : "bg-slate-800"
          )}
          onClick={() => applyTextStyle("underline")}
        >
          <MaterialIcons name="format-underline" size={24} color="#e4e4e7" />
        </button>
        <button
          className={cn(
            "toolbar-button",
            isStrikethrough ? "bg-slate-900" : "bg-slate-800"
          )}
          onClick={() => applyTextStyle("strikethrough")}
        >
          <MaterialIcons
            name="format-strikethrough"
            size={24}
            color="#e4e4e7"
          />
        </button>

        <button
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
          className="toolbar-button bg-slate-800"
        >
          <Feather name="align-left" size={24} color="#e4e4e7" />
        </button>
        <button
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")
          }
          className="toolbar-button bg-slate-800"
        >
          <Feather name="align-center" size={24} color="#e4e4e7" />
        </button>
        <button
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")
          }
          className="toolbar-button bg-slate-800"
        >
          <Feather name="align-justify" size={24} color="#e4e4e7" />
        </button>
        <button
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")
          }
          className="toolbar-button bg-slate-800"
        >
          <Feather name="align-right" size={24} color="#e4e4e7" />
        </button>
      </div>
    </>
  );
}
