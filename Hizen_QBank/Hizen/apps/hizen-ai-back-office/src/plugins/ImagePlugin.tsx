import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $createRangeSelection,
  $getSelection,
  $insertNodes,
  $isNodeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DRAGOVER_COMMAND,
  DRAGSTART_COMMAND,
  DROP_COMMAND,
  LexicalCommand,
  LexicalEditor,
} from 'lexical';
import { useEffect } from 'react';

import {
  $createImageNode,
  $isImageNode,
  ImageNode,
  ImagePayload,
} from '../nodes/ImageNode'; // Adjust path as needed

export type InsertImagePayload = Readonly<ImagePayload>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand('INSERT_IMAGE_COMMAND');

export function ImagePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagePlugin: ImageNode not registered on editor');
    }

    return mergeRegister(
      editor.registerCommand<InsertImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const selection = $getSelection();
          // TODO: Handle inserting into tables or other complex structures if needed
          if (selection) {
            // Can be null
            const imageNode = $createImageNode(payload);
            $insertNodes([imageNode]);
            if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
              $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
            }
          }
          return true; // Command was handled
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      // Add Drag and Drop handling (Optional but recommended)
      // TODO: Implement drag/drop handlers if needed
      // editor.registerCommand<DragEvent>(DRAGSTART_COMMAND, ...)
      // editor.registerCommand<DragEvent>(DRAGOVER_COMMAND, ...)
      // editor.registerCommand<DragEvent>(DROP_COMMAND, ...)
    );
  }, [editor]);

  return null; // This plugin doesn't render anything itself
}

export default ImagePlugin;
