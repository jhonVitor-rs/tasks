import { cn } from "@/utils/cn";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_ELEMENT_COMMAND } from "lexical";
import { useState } from "react";

export function TextAlign() {
  const [editor] = useLexicalComposerContext();
  const [visibleTextAlignEditor, setVisibleTextAlignEditor] = useState(false);
  const [textAlignType, setTextAlignType] = useState();

  return (
    <>
      <button
        className={cn(
          "toolbar-button",
          visibleTextAlignEditor ? "bg-slate-900" : "bg-slate-800"
        )}
        onClick={() => {
          setVisibleTextAlignEditor(!visibleTextAlignEditor), editor.focus();
        }}
      >
        <MaterialIcons
          name="align-horizontal-center"
          size={24}
          color="#e4e4e7"
        />
      </button>
      <div
        className={cn(
          "absolute toolbar rounded-md border top-[-60px] left-1/2 transform -translate-x-1/2",
          visibleTextAlignEditor ? "opacity-100" : "opacity-0"
        )}
        style={{ transition: "opacity 0.4s ease" }}
      >
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
