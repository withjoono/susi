import React, { useState, useEffect, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { NodeKey, $getNodeByKey } from 'lexical';
import katex from 'katex';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Typography,
} from '@material-tailwind/react';
import 'katex/dist/katex.min.css';
import { KaTeXNode, $isKaTeXNode } from '../nodes/KaTeXNode';

interface KaTeXComponentProps {
  formula: string;
  displayMode: boolean;
  nodeKey: NodeKey;
}

export default function KaTeXComponent({
  formula,
  displayMode,
  nodeKey,
}: KaTeXComponentProps): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editFormula, setEditFormula] = useState(formula);
  const [previewHtml, setPreviewHtml] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [displayModeOption, setDisplayModeOption] = useState(displayMode);

  // Render KaTeX formula
  const renderKaTeX = useCallback((tex: string, display: boolean): string => {
    try {
      return katex.renderToString(tex, {
        displayMode: display,
        throwOnError: false,
        errorColor: '#f44336',
      });
    } catch (err) {
      if (err instanceof Error) {
        console.error('KaTeX rendering error:', err.message);
        return `<span style="color: #f44336;">Error: ${err.message}</span>`;
      }
      return '<span style="color: #f44336;">Error rendering formula</span>';
    }
  }, []);

  // Update preview in edit dialog
  useEffect(() => {
    if (isEditing) {
      try {
        setPreviewHtml(renderKaTeX(editFormula, displayModeOption));
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error rendering formula');
        }
      }
    }
  }, [isEditing, editFormula, displayModeOption, renderKaTeX]);

  // Handle saving edits
  const handleSave = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (node && $isKaTeXNode(node)) {
        node.setFormula(editFormula);
        node.setDisplayMode(displayModeOption);
      }
    });
    setIsEditing(false);
  };

  // Handle deleting the node
  const handleDelete = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (node) {
        node.remove();
      }
    });
    setIsEditing(false);
  };

  // Handle opening the editor dialog
  const handleClick = () => {
    setEditFormula(formula);
    setDisplayModeOption(displayMode);
    setIsEditing(true);
  };

  // Render the formula with a click handler
  const formulaHtml = renderKaTeX(formula, displayMode);

  return (
    <>
      <span
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: formulaHtml }}
        className="cursor-pointer katex-wrapper hover:bg-gray-100 rounded px-1"
      />

      {isEditing && (
        <Dialog open={isEditing} handler={() => setIsEditing(false)}>
          <DialogHeader>
            <Typography variant="h6">Edit Math Formula</Typography>
          </DialogHeader>
          <DialogBody className="flex flex-col gap-4">
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Formula (LaTeX)
              </label>
              <Input
                value={editFormula}
                onChange={(e) => setEditFormula(e.target.value)}
                placeholder="E.g., E = mc^2"
                className="w-full"
              />
            </div>

            <div className="mb-2">
              <label className="flex items-center text-sm font-medium">
                <input
                  type="checkbox"
                  checked={displayModeOption}
                  onChange={(e) => setDisplayModeOption(e.target.checked)}
                  className="mr-2"
                />
                Display mode (centered on new line)
              </label>
            </div>

            <div className="mt-2">
              <label className="block text-sm font-medium mb-1">Preview</label>
              <div
                className="border p-3 rounded min-h-16 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
          </DialogBody>
          <DialogFooter className="flex justify-between">
            <Button onClick={handleDelete} variant="outlined" color="red">
              Delete
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsEditing(false)}
                variant="outlined"
                color="gray"
              >
                Cancel
              </Button>
              <Button onClick={handleSave} color="blue">
                Save
              </Button>
            </div>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
}
