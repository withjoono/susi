import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Button,
  IconButton,
  Typography,
  Select as MaterialSelect, // Renamed to avoid conflict
  Option,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from '@material-tailwind/react';

// Lexical Core
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND, // Import element format command
  $createParagraphNode,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_LOW,
  LexicalEditor as LexicalEditorType, // Renamed to avoid conflict with component name
  EditorState,
  $getRoot, // Import $getRoot
  $insertNodes, // Import $insertNodes from 'lexical'
  $getNodeByKey, // Import for fetching node by key
  LexicalCommand, // For creating custom commands
  createCommand, // For creating custom commands
  NodeKey, // Ensure NodeKey is imported here
} from 'lexical';

// Lexical React
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin'; // Import TablePlugin

// Lexical Nodes
import {
  HeadingNode,
  $isHeadingNode,
  QuoteNode,
  $createQuoteNode,
  $createHeadingNode,
  HeadingTagType,
} from '@lexical/rich-text';
import {
  TableCellNode,
  TableNode,
  TableRowNode,
  INSERT_TABLE_COMMAND,
  $isTableNode, // Import $isTableNode
  $isTableRowNode, // Import $isTableRowNode
  $isTableCellNode, // Import $isTableCellNode
} from '@lexical/table';
import {
  ListItemNode,
  ListNode,
  $isListNode,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import {
  CodeHighlightNode,
  CodeNode,
  $isCodeNode,
  $createCodeNode,
  getCodeLanguages,
  getDefaultCodeLanguage,
} from '@lexical/code';
import {
  AutoLinkNode,
  LinkNode,
  $isLinkNode,
  TOGGLE_LINK_COMMAND,
} from '@lexical/link';
import { ImageNode, $isImageNode } from '../nodes/ImageNode'; // Adjust path if needed, ensure $isImageNode is exported and imported
import { KaTeXNode } from '../nodes/KaTeXNode';
import { GraphNode } from '../nodes/GraphNode';
import katex from 'katex';

// Lexical Utils
import { $wrapNodes, $isAtNodeEnd } from '@lexical/selection';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';

// HTML Conversion
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';

// Import alignment icons from Heroicons
import {
  Bars3BottomLeftIcon,
  Bars3Icon, // Center
  Bars3BottomRightIcon,
  Bars4Icon, // Justify
} from '@heroicons/react/24/outline';

// --- Image Plugin Import ---
import ImagePlugin, {
  INSERT_IMAGE_COMMAND,
  InsertImagePayload,
} from '../plugins/ImagePlugin'; // Adjust path if needed
import KaTeXPlugin, { INSERT_KATEX_COMMAND } from '../plugins/KaTeXPlugin';
import GraphPlugin, { INSERT_GRAPH_COMMAND } from '../plugins/GraphPlugin';

// --- Toolbar Plugin Components (Adapted from Material Tailwind Example) ---

const LowPriority = COMMAND_PRIORITY_LOW;
const HighPriority = 2; // Or another appropriate priority like COMMAND_PRIORITY_HIGH

// --- Define Custom Command for Moving Image ---
export const MOVE_IMAGE_COMMAND: LexicalCommand<{ nodeKey: NodeKey }> =
  createCommand('MOVE_IMAGE_COMMAND');

// --- Define Custom Command for Updating Table Cell Padding ---
export const UPDATE_TABLE_CELL_PADDING_COMMAND: LexicalCommand<{
  padding: string;
}> = createCommand('UPDATE_TABLE_CELL_PADDING_COMMAND');

function getSelectedNode(selection: any) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');
  const [selectedTable, setSelectedTable] = useState<{
    node: TableNode;
  } | null>(null);
  const [cellPadding, setCellPadding] = useState('');

  // Add states for KaTeX dialog
  const [isKaTeXDialogOpen, setIsKaTeXDialogOpen] = useState(false);
  const [formulaInput, setFormulaInput] = useState(
    '\\sum_{i=1}^n i = \\frac{n(n+1)}{2}',
  );
  const [displayModeOption, setDisplayModeOption] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [katexError, setKatexError] = useState<string | null>(null);

  // Add states for Graph dialog
  const [isGraphDialogOpen, setIsGraphDialogOpen] = useState(false);
  const [graphFunctions, setGraphFunctions] = useState(['x^2']);
  const [graphTitle, setGraphTitle] = useState('');
  const [graphXLabel, setGraphXLabel] = useState('x');
  const [graphYLabel, setGraphYLabel] = useState('y');

  const updateToolbar = React.useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Simplified updateToolbar: only handle text formats and links
      // Removed logic for block types and selected element key

      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsCode(selection.hasFormat('code')); // Check for inline code

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      setIsLink($isLinkNode(parent) || $isLinkNode(node));

      // Check if inside a table
      const tableNode = $getNearestNodeOfType(node, TableNode);
      setSelectedTable(tableNode ? { node: tableNode } : null);

      if (tableNode) {
        // Attempt to read current padding from the first cell
        const firstRow = tableNode.getFirstChild();
        if ($isTableRowNode(firstRow)) {
          const firstCell = firstRow.getFirstChild();
          if ($isTableCellNode(firstCell)) {
            const domElement = editor.getElementByKey(firstCell.getKey());
            if (domElement && domElement.style.padding) {
              setCellPadding(domElement.style.padding.replace('px', '')); // Assuming px units
            } else {
              setCellPadding(''); // Default or if not set
            }
          } else {
            setCellPadding(''); // No first cell found
          }
        } else {
          setCellPadding(''); // No first row found
        }
      } else {
        setCellPadding('');
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, updateToolbar]);

  const insertLink = React.useCallback(() => {
    if (!isLink) {
      // Basic prompt for URL, replace with a proper modal/input if needed
      const url = prompt('Enter the URL:');
      if (url) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
      }
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const insertTable = React.useCallback(() => {
    // Basic prompt for rows/columns
    const rows = prompt('Enter number of rows:', '3');
    const columns = prompt('Enter number of columns:', '3');

    if (
      rows &&
      columns &&
      !isNaN(parseInt(rows)) &&
      !isNaN(parseInt(columns))
    ) {
      editor.dispatchCommand(INSERT_TABLE_COMMAND, {
        rows: rows, // Keep as string as per Lexical type
        columns: columns, // Keep as string as per Lexical type
      });
    } else {
      alert('Please enter valid numbers for rows and columns.');
    }
  }, [editor]);

  // --- Insert Image Handler ---
  const insertImage = React.useCallback(() => {
    const src = prompt('Enter the URL of the image:');
    if (src) {
      const payload: InsertImagePayload = {
        src,
        altText: 'User inserted image',
        // Optionally add width/height if needed
      };
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    } else {
      // Optionally handle cancellation or invalid input
    }
  }, [editor]);

  // Replace insertKaTeX function with a function that opens the dialog
  const insertKaTeX = React.useCallback(() => {
    setFormulaInput('\\sum_{i=1}^n i = \\frac{n(n+1)}{2}');
    setDisplayModeOption(false);
    setIsKaTeXDialogOpen(true);
  }, []);

  // Function to open the graph dialog
  const insertGraph = React.useCallback(() => {
    setGraphFunctions(['x^2']);
    setGraphTitle('');
    setGraphXLabel('x');
    setGraphYLabel('y');
    setIsGraphDialogOpen(true);
  }, []);

  // Add function to render KaTeX preview
  const renderKaTeX = React.useCallback(
    (tex: string, display: boolean): string => {
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
    },
    [],
  );

  // Update preview when formula or display mode changes
  useEffect(() => {
    if (isKaTeXDialogOpen) {
      try {
        setPreviewHtml(renderKaTeX(formulaInput, displayModeOption));
        setKatexError(null);
      } catch (err) {
        if (err instanceof Error) {
          setKatexError(err.message);
        } else {
          setKatexError('Error rendering formula');
        }
      }
    }
  }, [isKaTeXDialogOpen, formulaInput, displayModeOption, renderKaTeX]);

  // Handle insertion of KaTeX when dialog is confirmed
  const handleInsertKaTeX = () => {
    editor.dispatchCommand(INSERT_KATEX_COMMAND, {
      formula: formulaInput,
      displayMode: displayModeOption,
    });
    setIsKaTeXDialogOpen(false);
  };

  // Handle insertion of Graph when dialog is confirmed
  const handleInsertGraph = () => {
    editor.dispatchCommand(INSERT_GRAPH_COMMAND, {
      functions: graphFunctions.filter(f => f.trim() !== ''),
      title: graphTitle,
      xLabel: graphXLabel,
      yLabel: graphYLabel,
    });
    setIsGraphDialogOpen(false);
  };

  return (
    <div
      className="mb-2 flex flex-wrap items-center gap-1 rounded border p-1"
      ref={toolbarRef}
    >
      <>
        <IconButton
          variant={isBold ? 'filled' : 'text'}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
          }}
          aria-label="Format Bold"
          size="sm"
        >
          <svg
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="currentColor"
            className="h-4 w-4"
          >
            <path
              d="M12 11.6667H8M12 11.6667C12 11.6667 15.3333 11.6667 15.3333 8.33333C15.3333 5.00002 12 5 12 5C12 5 12 5 12 5H8.6C8.26863 5 8 5.26863 8 5.6V11.6667M12 11.6667C12 11.6667 16 11.6667 16 15.3333C16 19 12 19 12 19C12 19 12 19 12 19H8.6C8.26863 19 8 18.7314 8 18.4V11.6667"
              stroke="currentColor"
              strokeWidth="1.5"
            ></path>
          </svg>
        </IconButton>
        <IconButton
          variant={isItalic ? 'filled' : 'text'}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
          }}
          aria-label="Format Italics"
          size="sm"
        >
          <svg
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="currentColor"
            className="h-4 w-4"
          >
            <path
              d="M11 5L14 5M17 5L14 5M14 5L10 19M10 19L7 19M10 19L13 19"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </IconButton>
        <IconButton
          variant={isCode ? 'filled' : 'text'}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code'); // Inline code
          }}
          aria-label="Insert Inline Code"
          size="sm"
        >
          <svg
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="currentColor"
            className="h-4 w-4"
          >
            <path
              d="M13.5 6L10 18.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M6.5 8.5L3 12L6.5 15.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M17.5 8.5L21 12L17.5 15.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </IconButton>
        <IconButton
          onClick={insertLink}
          variant={isLink ? 'filled' : 'text'}
          aria-label="Insert Link"
          size="sm"
        >
          <svg
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="currentColor"
            className="h-4 w-4"
          >
            <path
              d="M14 11.9976C14 9.5059 11.683 7 8.85714 7C8.52241 7 7.41904 7.00001 7.14286 7.00001C4.30254 7.00001 2 9.23752 2 11.9976C2 14.376 3.70973 16.3664 6 16.8714C6.36756 16.9525 6.75006 16.9952 7.14286 16.9952"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M10 11.9976C10 14.4893 12.317 16.9952 15.1429 16.9952C15.4776 16.9952 16.581 16.9952 16.8571 16.9952C19.6975 16.9952 22 14.7577 22 11.9976C22 9.6192 20.2903 7.62884 18 7.12383C17.6324 7.04278 17.2499 6.99999 16.8571 6.99999"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </IconButton>
        <IconButton
          onClick={insertTable}
          variant={'text'} // Or 'filled' when active/relevant
          aria-label="Insert Table"
          size="sm"
        >
          <svg
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="currentColor"
            className="h-4 w-4"
          >
            <path
              d="M3 5h18M3 12h18M3 19h18M5 3v18M12 3v18M19 3v18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </IconButton>
        <IconButton
          onClick={insertImage}
          variant={'text'}
          aria-label="Insert Image"
          size="sm"
        >
          <svg
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="currentColor"
            className="h-4 w-4"
          >
            <path
              d="M21 3.6v16.8c0 1.32-1.08 2.4-2.4 2.4H5.4C4.08 22.8 3 21.72 3 20.4V3.6C3 2.28 4.08 1.2 5.4 1.2h13.2c1.32 0 2.4 1.08 2.4 2.4zm-3 7.4c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm-8.5 6l2.5-3 2 2.5 4-5 3 3.5V3.6H5.4v13.8z"
              fill="currentColor"
            ></path>
          </svg>
        </IconButton>
        <IconButton
          onClick={insertKaTeX}
          variant={'text'}
          aria-label="Insert Math Formula"
          size="sm"
        >
          <span className="font-bold italic">f(x)</span>
        </IconButton>
        <IconButton
          onClick={insertGraph}
          variant={'text'}
          aria-label="Insert Graph"
          size="sm"
        >
          <svg
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="currentColor"
            className="h-4 w-4"
          >
            <path
              d="M3 3v18h18M7 14l4-4 4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </IconButton>
      </>
      {/* Divider */}
      <div className="h-full w-px bg-gray-300 mx-1"></div>
      {/* Alignment Buttons */}
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
        aria-label="Left Align"
        size="sm"
        variant="text" // Add variant for consistency, consider active state later
      >
        <Bars3BottomLeftIcon className="h-4 w-4" />
      </IconButton>
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        aria-label="Center Align"
        size="sm"
        variant="text"
      >
        <Bars3Icon className="h-4 w-4" />
      </IconButton>
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        aria-label="Right Align"
        size="sm"
        variant="text"
      >
        <Bars3BottomRightIcon className="h-4 w-4" />
      </IconButton>
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
        }}
        aria-label="Justify Align"
        size="sm"
        variant="text"
      >
        <Bars4Icon className="h-4 w-4" />
      </IconButton>

      {/* Table Cell Padding Input - Appears if a table is selected */}
      {selectedTable && (
        <>
          <div className="h-full w-px bg-gray-300 mx-1"></div>
          <div className="flex items-center gap-1">
            <span className="text-xs">Cell Padding:</span>
            <input
              type="number"
              value={cellPadding}
              onChange={(e) => {
                const paddingValue = e.target.value;
                setCellPadding(paddingValue);
                if (paddingValue.trim() !== '') {
                  editor.dispatchCommand(UPDATE_TABLE_CELL_PADDING_COMMAND, {
                    padding: `${paddingValue}px`,
                  });
                }
              }}
              className="w-12 text-sm border rounded px-1 py-0.5"
              placeholder="px"
            />
          </div>
        </>
      )}

      {/* KaTeX Dialog */}
      <Dialog
        open={isKaTeXDialogOpen}
        handler={() => setIsKaTeXDialogOpen(false)}
      >
        <DialogHeader>
          <Typography variant="h6">Insert Math Formula</Typography>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">
              Formula (LaTeX)
            </label>
            <Input
              value={formulaInput}
              onChange={(e) => setFormulaInput(e.target.value)}
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
            {katexError && (
              <p className="text-red-500 text-sm mt-1">{katexError}</p>
            )}
          </div>
        </DialogBody>
        <DialogFooter className="flex gap-2 justify-end">
          <Button
            onClick={() => setIsKaTeXDialogOpen(false)}
            variant="outlined"
            color="gray"
          >
            Cancel
          </Button>
          <Button onClick={handleInsertKaTeX} color="blue">
            Insert
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Graph Dialog */}
      <Dialog
        open={isGraphDialogOpen}
        handler={() => setIsGraphDialogOpen(false)}
        size="lg"
      >
        <DialogHeader>Insert Graph</DialogHeader>
        <DialogBody className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Functions</label>
            {graphFunctions.map((func, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  type="text"
                  value={func}
                  onChange={(e) => {
                    const newFunctions = [...graphFunctions];
                    newFunctions[index] = e.target.value;
                    setGraphFunctions(newFunctions);
                  }}
                  placeholder="e.g., x^2, sin(x), cos(x)"
                  className="flex-1"
                />
                {graphFunctions.length > 1 && (
                  <Button
                    onClick={() => {
                      const newFunctions = graphFunctions.filter((_, i) => i !== index);
                      setGraphFunctions(newFunctions);
                    }}
                    color="red"
                    size="sm"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              onClick={() => setGraphFunctions([...graphFunctions, ''])}
              color="blue"
              variant="outlined"
              size="sm"
            >
              Add Function
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              type="text"
              value={graphTitle}
              onChange={(e) => setGraphTitle(e.target.value)}
              placeholder="Graph title (optional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">X-axis Label</label>
              <Input
                type="text"
                value={graphXLabel}
                onChange={(e) => setGraphXLabel(e.target.value)}
                placeholder="x"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Y-axis Label</label>
              <Input
                type="text"
                value={graphYLabel}
                onChange={(e) => setGraphYLabel(e.target.value)}
                placeholder="y"
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex gap-2 justify-end">
          <Button
            onClick={() => setIsGraphDialogOpen(false)}
            variant="outlined"
            color="gray"
          >
            Cancel
          </Button>
          <Button onClick={handleInsertGraph} color="blue">
            Insert Graph
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

// --- Placeholder Component ---
function Placeholder() {
  return (
    <div className="pointer-events-none absolute left-2.5 top-4 select-none overflow-hidden text-base font-normal text-gray-400">
      Enter content...
    </div>
  );
}

// --- Image Drag and Drop Plugin ---
function ImageDndPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const editorElement = editor.getRootElement();
    if (!editorElement) return;

    const handleDragOver = (event: DragEvent) => {
      // Check if we're dragging something that our editor can handle
      if (
        event.dataTransfer?.types.includes(
          'application/x-lexical-image-node-key',
        )
      ) {
        event.preventDefault(); // Allow drop by preventing default handling
        // Optionally, provide visual feedback here (e.g., change border style)
      }
    };

    const handleDrop = (event: DragEvent) => {
      event.preventDefault(); // Prevent default browser handling (e.g., opening image in new tab)
      const draggedNodeKey = event.dataTransfer?.getData(
        'application/x-lexical-image-node-key',
      );

      if (draggedNodeKey) {
        // Set the selection to the drop point if possible - this is a simplified approach
        // For more accuracy, you might need to calculate the nearest node/offset from event.clientX/Y
        const { clientX, clientY } = event;
        editor.update(() => {
          const range = document.caretRangeFromPoint(clientX, clientY);
          if (range) {
            const selection = $getSelection(); // Get current selection
            if ($isRangeSelection(selection)) {
              selection.applyDOMRange(range); // Try to set selection to drop point
            }
          }
        });

        // Dispatch the command to move the image node
        // The command handler will use the current selection as the insertion point
        editor.dispatchCommand(MOVE_IMAGE_COMMAND, {
          nodeKey: draggedNodeKey as NodeKey,
        });
      }
    };

    editorElement.addEventListener('dragover', handleDragOver);
    editorElement.addEventListener('drop', handleDrop);

    return () => {
      editorElement.removeEventListener('dragover', handleDragOver);
      editorElement.removeEventListener('drop', handleDrop);
    };
  }, [editor]);

  return null; // This plugin doesn't render anything
}

// --- Editor Component ---
interface LexicalEditorProps {
  initialHtml?: string | null;
  onChange: (html: string) => void;
  readOnly?: boolean;
  stableKey?: string; // Add stableKey prop
}

// Function to safely parse initial HTML
const updateEditorState = (
  editor: LexicalEditorType,
  htmlString: string | null | undefined,
) => {
  if (!htmlString) {
    // Handle empty content if necessary, maybe clear the editor
    editor.update(() => {
      const root = $getRoot(); // Use $getRoot
      root.clear();
      root.append($createParagraphNode()); // Ensure there's at least a paragraph
    });
    return;
  }

  try {
    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(htmlString, 'text/html');

      const nodes = $generateNodesFromDOM(editor, dom);

      const root = $getRoot(); // Use $getRoot
      root.clear();
      root.select();
      $insertNodes(nodes); // Use $insertNodes
    });
  } catch (error) {
    console.error(
      'Error setting initial editor state from HTML:',
      error,
      htmlString,
    );
    // Fallback to empty state or show an error
    editor.update(() => {
      const root = $getRoot(); // Use $getRoot
      root.clear();
      root.append($createParagraphNode());
    });
  }
};

function Editor({ initialHtml, onChange, readOnly }: LexicalEditorProps) {
  const [editor] = useLexicalComposerContext();
  const isReadOnly = readOnly ?? false;
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // 🎯 Option 1: Unidirectional Flow - 초기화 상태 추적
  const isInitializedRef = useRef<boolean>(false);
  
  // 🎯 Option 2: State Reconciliation - 마지막 처리된 HTML 추적
  const lastProcessedHtmlRef = useRef<string>('');

  // HTML 정규화 함수 (비교 정확도 향상)
  const normalizeHtml = (html: string): string => {
    if (!html) return '';
    return html
      .replace(/\s+/g, ' ') // 연속 공백을 하나로
      .replace(/>\s+</g, '><') // 태그 사이 공백 제거
      .trim();
  };

  // Set initial content ONLY on first load (Option 1: Unidirectional Flow)
  useEffect(() => {
    const normalizedInitialHtml = normalizeHtml(initialHtml || '');
    const normalizedLastProcessed = normalizeHtml(lastProcessedHtmlRef.current);
    
    // 🚀 초기화되지 않았거나, 실제로 HTML이 변경된 경우에만 업데이트
    if (!isInitializedRef.current || 
        (normalizedInitialHtml !== normalizedLastProcessed && normalizedInitialHtml !== '')) {
      
      console.log('🔄 Editor 상태 업데이트:', {
        초기화상태: isInitializedRef.current ? '✅ 완료' : '❌ 미완료',
        HTML변경: normalizedInitialHtml !== normalizedLastProcessed ? '✅ 변경됨' : '❌ 동일함',
        소스: !isInitializedRef.current ? '초기 로드' : '외부 변경'
      });
      
      updateEditorState(editor, initialHtml);
      lastProcessedHtmlRef.current = initialHtml || '';
      isInitializedRef.current = true;
    } else {
      console.log('⏭️ Editor 업데이트 건너뜀 (변경 없음 또는 내부 변경)');
    }
    
    editor.setEditable(!isReadOnly);
  }, [editor, initialHtml, isReadOnly]);

  // Register MOVE_IMAGE_COMMAND handler
  useEffect(() => {
    if (!editor.isEditable()) return; // Only register if editable

    const unregisterMoveImage = editor.registerCommand(
      MOVE_IMAGE_COMMAND,
      (payload) => {
        editor.update(() => {
          const { nodeKey } = payload;
          const imageNode = $getNodeByKey(nodeKey);

          if (!$isImageNode(imageNode)) {
            return false; // Not an image node, do nothing
          }

          // Remove the node from its current position
          imageNode.remove();

          // Insert the image node at the current selection point
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            selection.insertNodes([imageNode]);
          } else {
            // Fallback: if no range selection, append to the root
            // This might happen if the drop point doesn't correspond to a valid text insertion point
            $getRoot().append(imageNode);
          }
        });
        return true; // Command was handled
      },
      HighPriority, // Use an appropriate priority
    );

    // Register UPDATE_TABLE_CELL_PADDING_COMMAND handler
    const unregisterUpdateTablePadding = editor.registerCommand(
      UPDATE_TABLE_CELL_PADDING_COMMAND,
      (payload) => {
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return false;

          const selectedNode = getSelectedNode(selection);
          const tableNode = $getNearestNodeOfType(selectedNode, TableNode);

          if (!tableNode) {
            // If no table is directly selected, try to find one from the root if a single table exists
            // This is a fallback, ideally selection should be within/on the table
            const root = $getRoot();
            const tablesInDoc = root.getChildren().filter($isTableNode);
            if (tablesInDoc.length === 1 && $isTableNode(tablesInDoc[0])) {
              // If only one table in doc, assume that one for now if no specific selection
              // This part can be improved for better context detection
              const singleTable = tablesInDoc[0] as TableNode;
              singleTable.getChildren().forEach((row) => {
                if ($isTableRowNode(row)) {
                  row.getChildren().forEach((cell) => {
                    if ($isTableCellNode(cell)) {
                      const cellElement = editor.getElementByKey(cell.getKey());
                      if (cellElement) {
                        cellElement.style.padding = payload.padding;
                      }
                    }
                  });
                }
              });
            } else {
              return false; // No clear table target
            }
          } else {
            // Apply to all cells in the currently selected/focused tableNode
            tableNode.getChildren().forEach((row) => {
              if ($isTableRowNode(row)) {
                row.getChildren().forEach((cell) => {
                  if ($isTableCellNode(cell)) {
                    const cellElement = editor.getElementByKey(cell.getKey());
                    if (cellElement) {
                      cellElement.style.padding = payload.padding;
                    }
                  }
                });
              }
            });
          }
        });
        return true; // Command was handled
      },
      HighPriority,
    );

    return () => {
      unregisterMoveImage();
      unregisterUpdateTablePadding();
    };
  }, [editor, isReadOnly]);

  // Debounced onChange handler with State Reconciliation
  const handleDebouncedChange = (editorState: EditorState) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editor, null);
        
        // 🎯 Option 2: State Reconciliation - 실제 변경 여부 확인
        const normalizedNewHtml = normalizeHtml(html);
        const normalizedLastProcessed = normalizeHtml(lastProcessedHtmlRef.current);
        
        if (normalizedNewHtml !== normalizedLastProcessed) {
          console.log('📤 onChange: HTML 변경 감지 - 외부로 전달');
          lastProcessedHtmlRef.current = html; // 새로운 HTML을 기록
          onChange(html); // 외부로 변경사항 전달
        } else {
          console.log('⏭️ onChange: HTML 동일 - 전달 건너뜀');
        }
      });
    }, 300);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative rounded-b-lg border-opacity-5 bg-white">
      {!isReadOnly && <ToolbarPlugin />}
      <div
        className={`relative ${
          isReadOnly ? '' : 'border rounded min-h-[200px]'
        }`}
      >
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className={`lexical min-h-[200px] resize-none px-2.5 py-4 text-base caret-gray-900 outline-none ${
                isReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
          }
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        {/* Re-enable OnChangePlugin with debounced handler */}
        <OnChangePlugin
          onChange={handleDebouncedChange} // Use the debounced handler
          ignoreSelectionChange // Important to avoid excessive updates
        />
        <HistoryPlugin />
        {!isReadOnly && <AutoFocusPlugin />}
        <ListPlugin />
        <LinkPlugin />
        <TablePlugin />
        {!isReadOnly && <ImagePlugin />}
        {!isReadOnly && <ImageDndPlugin />}
        {!isReadOnly && <KaTeXPlugin />}
        {!isReadOnly && <GraphPlugin />}
      </div>
    </div>
  );
}

const editorConfig = {
  namespace: 'LexicalEditor',
  onError(error: Error) {
    console.error('Lexical editor error:', error);
    throw error; // Re-throw or handle as needed
  },
  // The editor theme - can be customized
  theme: {
    // See https://lexical.dev/docs/getting-started/theming
    // Add theme styles here if needed, or rely on global CSS
    paragraph: 'lexical-paragraph', // Example class for styling
    heading: {
      h1: 'lexical-h1',
      h2: 'lexical-h2',
    },
    list: {
      ul: 'lexical-ul',
      ol: 'lexical-ol',
      listitem: 'lexical-li',
    },
    quote: 'lexical-blockquote',
    code: 'lexical-code', // Inline code
    link: 'lexical-link', // Example link class
    table: 'lexical-table',
    tableRow: 'lexical-table-row',
    tableCell: 'lexical-table-cell',
    tableCellHeader: 'lexical-table-cell-header', // Optional: For header cells if used
    image: 'lexical-image', // Class for the span wrapper of the image component
    katex: 'lexical-katex', // Class for KaTeX formula wrapper
    graph: 'lexical-graph', // Class for Graph wrapper
  },
  // Registering nodes is crucial!
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode, // For code blocks
    CodeHighlightNode, // For syntax highlighting in code blocks
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
    ImageNode, // <-- Register ImageNode
    KaTeXNode, // Add KaTeXNode
    GraphNode, // Add GraphNode
  ],
};

// Main Component Export
const LexicalEditor: React.FC<LexicalEditorProps> = ({
  initialHtml,
  onChange,
  readOnly,
  stableKey, // Destructure stableKey
}) => {
  // Need a key to force re-creation when initialHtml is drastically different,
  // especially when switching between questions in the dialog.
  // const editorKey = React.useMemo(() => Date.now().toString(), [initialHtml]); // REMOVE this line

  return (
    <LexicalComposer
      initialConfig={{
        ...editorConfig,
        editorState: null,
        editable: !readOnly,
      }}
      // Use the stableKey provided by the parent component
      key={stableKey || Date.now().toString()} // Use stableKey or fallback (fallback might still cause issues if stableKey is missing)
    >
      <Editor
        initialHtml={initialHtml}
        onChange={onChange}
        readOnly={readOnly}
      />
    </LexicalComposer>
  );
};

export default LexicalEditor;
