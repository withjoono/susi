import React from 'react';
import { NodeKey } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

interface ImageComponentProps {
  src: string;
  altText: string;
  width: 'inherit' | number;
  height: 'inherit' | number;
  maxWidth: number;
  nodeKey: NodeKey;
  resizable?: boolean; // Assuming this might be used for resizing later
}

const ImageComponent: React.FC<ImageComponentProps> = ({
  src,
  altText,
  width,
  height,
  maxWidth,
  nodeKey,
  resizable,
}) => {
  const [editor] = useLexicalComposerContext();

  const handleDragStart = (event: React.DragEvent<HTMLImageElement>) => {
    if (!editor.isEditable()) {
      event.preventDefault();
      return;
    }
    // Store the node key to identify the dragged image
    event.dataTransfer.setData('application/x-lexical-image-node-key', nodeKey);
    // You can also set a drag image if needed, but the browser default is usually fine for images
    // event.dataTransfer.setDragImage(event.currentTarget, 0, 0);
  };

  const imgStyle: React.CSSProperties = {
    maxWidth: `${maxWidth}px`,
    cursor: editor.isEditable() ? 'grab' : 'default', // Initial cursor
  };

  if (width !== 'inherit') {
    imgStyle.width = `${width}px`;
  }
  if (height !== 'inherit') {
    imgStyle.height = `${height}px`;
  }

  const onDragOver = (event: React.DragEvent<HTMLImageElement>) => {
    if (editor.isEditable()) {
      // event.currentTarget.style.cursor = 'grabbing'; // This flickers, better handled by browser
    }
  };

  const onDragEnd = (event: React.DragEvent<HTMLImageElement>) => {
    // event.currentTarget.style.cursor = 'grab'; // Reset cursor
  };

  return (
    <img
      src={src}
      alt={altText}
      draggable={editor.isEditable()} // Only draggable if editor is editable
      onDragStart={handleDragStart}
      onDragOver={onDragOver} // Potentially for cursor changes during drag
      onDragEnd={onDragEnd} // Reset cursor
      style={imgStyle}
      // Add a class if more complex styling or :hover/:active states are needed via CSS
      // className={editor.isEditable() ? "draggable-image" : ""}
    />
  );
};

export default ImageComponent;
