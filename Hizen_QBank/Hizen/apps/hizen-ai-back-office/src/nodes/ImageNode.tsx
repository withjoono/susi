import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedEditor,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

import { DecoratorNode } from 'lexical';
import * as React from 'react';
// Standard Import instead of Lazy Loading
import ImageComponent from '../components/ImageComponent.tsx'; // Added .tsx extension

export interface ImagePayload {
  altText: string;
  height?: number;
  key?: NodeKey;
  maxWidth?: number;
  src: string;
  width?: number;
}

function convertImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    const { alt: altText, src, width, height } = domNode;
    const node = $createImageNode({ altText, height, src, width });
    return { node };
  }
  return null;
}

export type SerializedImageNode = Spread<
  {
    altText: string;
    height?: number;
    maxWidth: number;
    src: string;
    width?: number;
    type: 'image'; // Important: Must match node type
    version: 1;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __width: 'inherit' | number;
  __height: 'inherit' | number;
  __maxWidth: number;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__key,
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, height, width, maxWidth, src } = serializedNode;
    const node = $createImageNode({
      altText,
      height,
      maxWidth,
      src,
      width,
    });
    return node;
  }

  exportJSON(): SerializedImageNode {
    return {
      altText: this.getAltText(),
      height: this.__height === 'inherit' ? 0 : this.__height,
      maxWidth: this.__maxWidth,
      src: this.getSrc(),
      type: 'image',
      version: 1,
      width: this.__width === 'inherit' ? 0 : this.__width,
    };
  }

  // Convert DOM element to Lexical Node
  static importDOM(): DOMConversionMap | null {
    return {
      img: (node: Node) => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    };
  }

  // Convert Lexical Node to DOM element
  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    element.setAttribute('alt', this.__altText);
    if (this.__width !== 'inherit') {
      element.setAttribute('width', this.__width.toString());
    }
    if (this.__height !== 'inherit') {
      element.setAttribute('height', this.__height.toString());
    }
    // Add any other attributes or styling as needed
    return { element };
  }

  constructor(
    src: string,
    altText: string,
    maxWidth: number,
    width?: 'inherit' | number,
    height?: 'inherit' | number,
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__maxWidth = maxWidth;
    this.__width = width || 'inherit';
    this.__height = height || 'inherit';
  }

  // --- Getters ---
  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  // --- Mutators ---
  setSrc(src: string): void {
    const writable = this.getWritable();
    writable.__src = src;
  }

  setAltText(altText: string): void {
    const writable = this.getWritable();
    writable.__altText = altText;
  }

  setWidth(width: 'inherit' | number): void {
    const writable = this.getWritable();
    writable.__width = width;
  }

  setHeight(height: 'inherit' | number): void {
    const writable = this.getWritable();
    writable.__height = height;
  }

  // --- View ---
  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    const theme = config.theme;
    const className = theme.image; // Assuming 'image' class in theme
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(): false {
    // Returning false means that this node doesn't need its
    // DOM element replacing with a new copy from createDOM.
    return false;
  }

  decorate(): JSX.Element {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        maxWidth={this.__maxWidth}
        nodeKey={this.getKey()}
        resizable={true} // Or false based on your requirements
      />
    );
  }
}

export function $createImageNode({
  altText,
  height,
  maxWidth = 500, // Default max width
  src,
  width,
  key,
}: ImagePayload): ImageNode {
  return new ImageNode(src, altText, maxWidth, width, height, key);
}

export function $isImageNode(
  node: LexicalNode | null | undefined,
): node is ImageNode {
  return node instanceof ImageNode;
}
