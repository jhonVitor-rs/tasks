import Entypo from "@expo/vector-icons/Entypo";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createCodeNode } from "@lexical/code";
import { $createQuoteNode } from "@lexical/rich-text";
import {
  $createParagraphNode,
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  TextFormatType,
} from "lexical";

interface CodeBlocksProps {
  blockType: string;
}

export function CodeBlocks({ blockType }: CodeBlocksProps) {
  const [editor] = useLexicalComposerContext();

  const applyBlock = (payload: TextFormatType) => {
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
        className="toolbar-button bg-slate-800"
        onClick={() => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              if (blockType === "paragraph") {
                const codeNode = $createCodeNode();
                if (selection.isCollapsed()) {
                  codeNode.append($createTextNode(""));
                } else {
                  codeNode.append($createTextNode(selection.getTextContent()));
                }
                selection.insertNodes([codeNode]);
              } else {
                const anchorNode = selection.anchor.getNode();
                const codeBlockNode = anchorNode.getTopLevelElementOrThrow();
                const paragraphNode = $createParagraphNode();
                codeBlockNode.insertAfter(paragraphNode);
                paragraphNode.select();
              }
            }
          });
        }}
      >
        <Entypo name="code" size={24} color="#e4e4e7" />
      </button>
      <button
        className="toolbar-button bg-slate-800"
        onClick={() => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              if (blockType === "paragraph") {
                const quoteNode = $createQuoteNode();
                if (selection.isCollapsed()) {
                  quoteNode.append($createTextNode(""));
                } else {
                  quoteNode.append($createCodeNode(selection.getTextContent()));
                }
                selection.insertNodes([quoteNode]);
              } else {
                const anchorNode = selection.anchor.getNode();
                const quoteBlockNode = anchorNode.getTopLevelElementOrThrow();
                const paragraphNode = $createParagraphNode();
                quoteBlockNode.insertAfter(paragraphNode);
                paragraphNode.select();
              }
            }
          });
        }}
      >
        <Entypo name="quote" size={24} color="#e4e4e7" />
      </button>
    </>
  );
}
