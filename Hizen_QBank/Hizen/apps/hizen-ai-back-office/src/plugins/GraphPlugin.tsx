import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  createCommand,
  LexicalCommand,
} from 'lexical';
import { useEffect } from 'react';
import { $createGraphNode, GraphPayload } from '../nodes/GraphNode';

// Define the command to insert a graph
export const INSERT_GRAPH_COMMAND: LexicalCommand<GraphPayload> = createCommand(
  'INSERT_GRAPH_COMMAND',
);

export default function GraphPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand<GraphPayload>(
      INSERT_GRAPH_COMMAND,
      (payload) => {
        const {
          functions = ['x'],
          xDomain = [-10, 10],
          yDomain = [-10, 10],
          width = 400,
          height = 300,
          grid = true,
          axes = true,
          title = '',
          xLabel = 'x',
          yLabel = 'y',
        } = payload;

        editor.update(() => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            const graphNode = $createGraphNode({
              functions,
              xDomain,
              yDomain,
              width,
              height,
              grid,
              axes,
              title,
              xLabel,
              yLabel,
            });

            selection.insertNodes([graphNode]);
          }
        });

        return true;
      },
      2, // High priority
    );
  }, [editor]);

  return null;
} 