import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

import { DecoratorNode } from 'lexical';
import * as React from 'react';
import GraphComponent from '../components/GraphComponent';

export interface GraphPayload {
  functions: string[];
  xDomain?: [number, number];
  yDomain?: [number, number];
  width?: number;
  height?: number;
  grid?: boolean;
  axes?: boolean;
  title?: string;
  xLabel?: string;
  yLabel?: string;
  key?: NodeKey;
}

function convertGraphElement(domNode: Node): null | DOMConversionOutput {
  if (
    domNode instanceof HTMLElement &&
    domNode.tagName.toLowerCase() === 'div' &&
    domNode.getAttribute('data-graph') === 'true'
  ) {
    const functions = JSON.parse(domNode.getAttribute('data-functions') || '[]');
    const xDomain = JSON.parse(domNode.getAttribute('data-x-domain') || '[-10, 10]');
    const yDomain = JSON.parse(domNode.getAttribute('data-y-domain') || '[-10, 10]');
    const width = parseInt(domNode.getAttribute('data-width') || '400');
    const height = parseInt(domNode.getAttribute('data-height') || '300');
    const grid = domNode.getAttribute('data-grid') === 'true';
    const axes = domNode.getAttribute('data-axes') === 'true';
    const title = domNode.getAttribute('data-title') || '';
    const xLabel = domNode.getAttribute('data-x-label') || '';
    const yLabel = domNode.getAttribute('data-y-label') || '';
    
    const node = $createGraphNode({
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
    return { node };
  }
  return null;
}

export type SerializedGraphNode = Spread<
  {
    functions: string[];
    xDomain: [number, number];
    yDomain: [number, number];
    width: number;
    height: number;
    grid: boolean;
    axes: boolean;
    title: string;
    xLabel: string;
    yLabel: string;
    type: 'graph';
    version: 1;
  },
  SerializedLexicalNode
>;

export class GraphNode extends DecoratorNode<JSX.Element> {
  __functions: string[];
  __xDomain: [number, number];
  __yDomain: [number, number];
  __width: number;
  __height: number;
  __grid: boolean;
  __axes: boolean;
  __title: string;
  __xLabel: string;
  __yLabel: string;

  static getType(): string {
    return 'graph';
  }

  static clone(node: GraphNode): GraphNode {
    return new GraphNode(
      node.__functions,
      node.__xDomain,
      node.__yDomain,
      node.__width,
      node.__height,
      node.__grid,
      node.__axes,
      node.__title,
      node.__xLabel,
      node.__yLabel,
      node.__key
    );
  }

  static importJSON(serializedNode: SerializedGraphNode): GraphNode {
    const {
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
    } = serializedNode;
    const node = $createGraphNode({
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
    return node;
  }

  exportJSON(): SerializedGraphNode {
    return {
      functions: this.getFunctions(),
      xDomain: this.getXDomain(),
      yDomain: this.getYDomain(),
      width: this.getWidth(),
      height: this.getHeight(),
      grid: this.getGrid(),
      axes: this.getAxes(),
      title: this.getTitle(),
      xLabel: this.getXLabel(),
      yLabel: this.getYLabel(),
      type: 'graph',
      version: 1,
    };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (node: Node) => ({
        conversion: convertGraphElement,
        priority: 2,
      }),
    };
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const element = document.createElement('div');
    element.setAttribute('data-graph', 'true');
    element.setAttribute('data-functions', JSON.stringify(this.__functions));
    element.setAttribute('data-x-domain', JSON.stringify(this.__xDomain));
    element.setAttribute('data-y-domain', JSON.stringify(this.__yDomain));
    element.setAttribute('data-width', String(this.__width));
    element.setAttribute('data-height', String(this.__height));
    element.setAttribute('data-grid', String(this.__grid));
    element.setAttribute('data-axes', String(this.__axes));
    element.setAttribute('data-title', this.__title);
    element.setAttribute('data-x-label', this.__xLabel);
    element.setAttribute('data-y-label', this.__yLabel);
    element.className = 'graph-block';
    return { element };
  }

  constructor(
    functions: string[] = ['x'],
    xDomain: [number, number] = [-10, 10],
    yDomain: [number, number] = [-10, 10],
    width: number = 400,
    height: number = 300,
    grid: boolean = true,
    axes: boolean = true,
    title: string = '',
    xLabel: string = 'x',
    yLabel: string = 'y',
    key?: NodeKey
  ) {
    super(key);
    this.__functions = functions;
    this.__xDomain = xDomain;
    this.__yDomain = yDomain;
    this.__width = width;
    this.__height = height;
    this.__grid = grid;
    this.__axes = axes;
    this.__title = title;
    this.__xLabel = xLabel;
    this.__yLabel = yLabel;
  }

  // --- Getters ---
  getFunctions(): string[] {
    return this.__functions;
  }

  getXDomain(): [number, number] {
    return this.__xDomain;
  }

  getYDomain(): [number, number] {
    return this.__yDomain;
  }

  getWidth(): number {
    return this.__width;
  }

  getHeight(): number {
    return this.__height;
  }

  getGrid(): boolean {
    return this.__grid;
  }

  getAxes(): boolean {
    return this.__axes;
  }

  getTitle(): string {
    return this.__title;
  }

  getXLabel(): string {
    return this.__xLabel;
  }

  getYLabel(): string {
    return this.__yLabel;
  }

  // --- Mutators ---
  setFunctions(functions: string[]): void {
    const writable = this.getWritable();
    writable.__functions = functions;
  }

  setXDomain(xDomain: [number, number]): void {
    const writable = this.getWritable();
    writable.__xDomain = xDomain;
  }

  setYDomain(yDomain: [number, number]): void {
    const writable = this.getWritable();
    writable.__yDomain = yDomain;
  }

  setWidth(width: number): void {
    const writable = this.getWritable();
    writable.__width = width;
  }

  setHeight(height: number): void {
    const writable = this.getWritable();
    writable.__height = height;
  }

  setGrid(grid: boolean): void {
    const writable = this.getWritable();
    writable.__grid = grid;
  }

  setAxes(axes: boolean): void {
    const writable = this.getWritable();
    writable.__axes = axes;
  }

  setTitle(title: string): void {
    const writable = this.getWritable();
    writable.__title = title;
  }

  setXLabel(xLabel: string): void {
    const writable = this.getWritable();
    writable.__xLabel = xLabel;
  }

  setYLabel(yLabel: string): void {
    const writable = this.getWritable();
    writable.__yLabel = yLabel;
  }

  // --- View ---
  createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement('div');
    const theme = config.theme;
    const className = theme.graph;
    if (className !== undefined) {
      div.className = className;
    }
    div.setAttribute('data-graph-node', 'true');
    return div;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <GraphComponent
        functions={this.__functions}
        xDomain={this.__xDomain}
        yDomain={this.__yDomain}
        width={this.__width}
        height={this.__height}
        grid={this.__grid}
        axes={this.__axes}
        title={this.__title}
        xLabel={this.__xLabel}
        yLabel={this.__yLabel}
        nodeKey={this.getKey()}
      />
    );
  }
}

export function $createGraphNode(payload: GraphPayload): GraphNode {
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
    key,
  } = payload;
  
  return new GraphNode(
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
    key
  );
}

export function $isGraphNode(
  node: LexicalNode | null | undefined,
): node is GraphNode {
  return node instanceof GraphNode;
} 