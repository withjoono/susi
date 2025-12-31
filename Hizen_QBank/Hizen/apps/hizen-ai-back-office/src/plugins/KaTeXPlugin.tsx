import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  createCommand,
  LexicalCommand,
} from 'lexical';
import { useEffect } from 'react';
import { $createKaTeXNode, KaTeXPayload } from '../nodes/KaTeXNode';

// Define the command to insert a KaTeX formula
export const INSERT_KATEX_COMMAND: LexicalCommand<KaTeXPayload> = createCommand(
  'INSERT_KATEX_COMMAND',
);

export default function KaTeXPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand<KaTeXPayload>(
      INSERT_KATEX_COMMAND,
      (payload) => {
        const { formula, displayMode = false } = payload;

        editor.update(() => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            const kaTeXNode = $createKaTeXNode({
              formula,
              displayMode,
            });

            selection.insertNodes([kaTeXNode]);
          }
        });

        return true;
      },
      2, // High priority
    );
  }, [editor]);

  return null;
}
