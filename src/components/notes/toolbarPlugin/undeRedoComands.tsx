import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { REDO_COMMAND, UNDO_COMMAND } from "lexical";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

interface UndoRedoComandsProsp {
  canUndo: boolean;
  canRedo: boolean;
}

export function UndoRedoComands({ canRedo, canUndo }: UndoRedoComandsProsp) {
  const [editor] = useLexicalComposerContext();

  return (
    <>
      <button
        className="toolbar-button bg-slate-800 disabled:bg-slate-950"
        disabled={!canUndo}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
      >
        <FontAwesome5 name="undo" size={24} color="#e4e4e7" />
      </button>
      <button
        className="toolbar-button bg-slate-800 disabled:bg-slate-950"
        disabled={!canRedo}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
      >
        <FontAwesome5 name="redo" size={24} color="#e4e4e7" />
      </button>
    </>
  );
}
