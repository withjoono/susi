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
import KaTeXComponent from '../components/KaTeXComponent';

export interface KaTeXPayload {
  formula: string;
  displayMode?: boolean;
  key?: NodeKey;
}

function convertKaTeXElement(domNode: Node): null | DOMConversionOutput {
  if (
    domNode instanceof HTMLElement &&
    (domNode.tagName.toLowerCase() === 'span' ||
      domNode.tagName.toLowerCase() === 'div') &&
    domNode.getAttribute('data-katex') === 'true'
  ) {
    const formula = domNode.getAttribute('data-formula') || '';
    const displayMode = domNode.getAttribute('data-display-mode') === 'true';
    const node = $createKaTeXNode({ formula, displayMode });
    return { node };
  }
  return null;
}

export type SerializedKaTeXNode = Spread<
  {
    formula: string;
    displayMode: boolean;
    type: 'katex';
    version: 1;
  },
  SerializedLexicalNode
>;

export class KaTeXNode extends DecoratorNode<JSX.Element> {
  __formula: string;
  __displayMode: boolean;

  static getType(): string {
    return 'katex';
  }

  static clone(node: KaTeXNode): KaTeXNode {
    return new KaTeXNode(node.__formula, node.__displayMode, node.__key);
  }

  static importJSON(serializedNode: SerializedKaTeXNode): KaTeXNode {
    const { formula, displayMode } = serializedNode;
    const node = $createKaTeXNode({
      formula,
      displayMode,
    });
    return node;
  }

  exportJSON(): SerializedKaTeXNode {
    return {
      formula: this.getFormula(),
      displayMode: this.getDisplayMode(),
      type: 'katex',
      version: 1,
    };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (node: Node) => ({
        conversion: convertKaTeXElement,
        priority: 2,
      }),
      div: (node: Node) => ({
        conversion: convertKaTeXElement,
        priority: 2,
      }),
    };
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const element = document.createElement(this.__displayMode ? 'div' : 'span');
    element.setAttribute('data-katex', 'true');
    element.setAttribute('data-formula', this.__formula);
    element.setAttribute('data-display-mode', String(this.__displayMode));

    // Add a class for potential CSS styling
    element.className = this.__displayMode ? 'katex-block' : 'katex-inline';

    return { element };
  }

  constructor(formula: string, displayMode: boolean = false, key?: NodeKey) {
    super(key);
    this.__formula = formula;
    this.__displayMode = displayMode;
  }

  // --- Getters ---
  getFormula(): string {
    return this.__formula;
  }

  getDisplayMode(): boolean {
    return this.__displayMode;
  }

  // --- Mutators ---
  setFormula(formula: string): void {
    const writable = this.getWritable();
    writable.__formula = formula;
  }

  setDisplayMode(displayMode: boolean): void {
    const writable = this.getWritable();
    writable.__displayMode = displayMode;
  }

  // --- View ---
  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    const theme = config.theme;
    const className = theme.katex;
    if (className !== undefined) {
      span.className = className;
    }
    span.setAttribute('data-katex-node', 'true');
    return span;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <KaTeXComponent
        formula={this.__formula}
        displayMode={this.__displayMode}
        nodeKey={this.getKey()}
      />
    );
  }
}

export function $createKaTeXNode({
  formula,
  displayMode = false,
  key,
}: KaTeXPayload): KaTeXNode {
  return new KaTeXNode(formula, displayMode, key);
}

export function $isKaTeXNode(
  node: LexicalNode | null | undefined,
): node is KaTeXNode {
  return node instanceof KaTeXNode;
}
