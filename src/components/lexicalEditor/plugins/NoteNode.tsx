import {
    DOMExportOutput,
    EditorConfig,
    LexicalCommand,
    LexicalEditor,
    LexicalNode,
    NodeKey,
    SerializedLexicalNode,
    Spread,
    $createParagraphNode, $insertNodes, $isRootOrShadowRoot, COMMAND_PRIORITY_EDITOR, ElementNode, SerializedElementNode, RangeSelection, ParagraphNode, DOMConversionMap, DOMConversionOutput, ElementFormatType,
} from 'lexical';

import { $applyNodeReplacement, DecoratorNode, createCommand } from 'lexical';
import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { $wrapNodeInElement, mergeRegister, isHTMLElement } from '@lexical/utils';
import { Button, styled } from '@mui/material';
import ReactDOMServer from 'react-dom/server';

export type NoteType = "success" | "info" | "warn" | "error";

export type NotePayload = {
    key?: NodeKey;
    type: NoteType;
    text: string;
}
export type SerializedNoteType = Spread<{ payload: NotePayload }, SerializedLexicalNode>;

const palette = {
    "success": "#e3f7df",
    "info": "#fdf9e2",
    "warn": "#fdf9e2",
    "error": "#feebee",
}

// const NoteSuccess = styled("div")(({theme}) => (
//     {
//         padding: "12px",
//         backgroundColor: palette.success,
//     }
// ));

// const NoteInfo = styled("div")(({theme}) => (
//     {
//         padding: "12px",
//         backgroundColor: palette.info,
//     }
// ));

// const NoteWarn = styled("div")(({theme}) => (
//     {
//         padding: "12px",
//         backgroundColor: palette.warn,
//     }
// ));


// const NoteError = styled("div")(({theme}) => (
//     {
//         padding: "12px",
//         backgroundColor: palette.error,
//     }
// ));


function jsxToHtml(jsx: React.ReactElement): string {
    return ReactDOMServer.renderToStaticMarkup(jsx);
}

const NoteBase = styled("div")(({ theme }) => (
    {
        padding: "12px",
    }
));

export function $createNoteNode(): NoteNode {
    return $applyNodeReplacement(new NoteNode());
}

const NoteNodeElement = (props: { text: string, color: string, contentEditable?: boolean }) => {

    return <NoteBase contentEditable={props.contentEditable ?? false} style={{ backgroundColor: props.color }}>{props.text}</NoteBase>
}

export function addClassNamesToElement(
    element: HTMLElement,
    ...classNames: Array<typeof undefined | boolean | null | string>
): void {
    classNames.forEach((className) => {
        if (typeof className === 'string') {
            const classesToAdd = className.split(' ').filter((n) => n !== '');
            element.classList.add(...classesToAdd);
        }
    });
}

function convertBlockNoteElement(element: HTMLElement): DOMConversionOutput {
    const node = $createNoteNode();
    // if (element.style !== null) {
    //   node.setFormat(element.style.textAlign as ElementFormatType);
    // }
    return { node };
}

export type SerializedNoteNode = SerializedElementNode;

export class NoteNode extends ElementNode {

    static getType(): string {
        return 'quote';
    }

    static clone(node: NoteNode): NoteNode {
        return new NoteNode(node.__key);
    }

    constructor(key?: NodeKey) {
        super(key);
    }

    // View

    createDOM(config: EditorConfig): HTMLElement {
        const element = document.createElement('blockquote');
        addClassNamesToElement(element, config.theme.quote);
        return element;
    }
    updateDOM(prevNode: NoteNode, dom: HTMLElement): boolean {
        return false;
    }

    static importDOM(): DOMConversionMap | null {
        return {
            blockquote: (node: Node) => ({
                conversion: convertBlockNoteElement,
                priority: 0,
            }),
        };
    }

    exportDOM(editor: LexicalEditor): DOMExportOutput {
        const { element } = super.exportDOM(editor);

        if (element && isHTMLElement(element)) {
            if (this.isEmpty()) element.append(document.createElement('br'));

            const formatType = this.getFormatType();
            element.style.textAlign = formatType;

            const direction = this.getDirection();
            if (direction) {
                element.dir = direction;
            }
        }

        return {
            element,
        };
    }

    static importJSON(serializedNode: SerializedNoteNode): NoteNode {
        const node = $createNoteNode();
        node.setFormat(serializedNode.format);
        node.setIndent(serializedNode.indent);
        node.setDirection(serializedNode.direction);
        return node;
    }

    exportJSON(): SerializedElementNode {
        return {
            ...super.exportJSON(),
            type: 'note',
        };
    }

    // Mutation

    insertNewAfter(_: RangeSelection, restoreSelection?: boolean): ParagraphNode {
        const newBlock = $createParagraphNode();
        const direction = this.getDirection();
        newBlock.setDirection(direction);
        this.insertAfter(newBlock, restoreSelection);
        return newBlock;
    }

    collapseAtStart(): true {
        const paragraph = $createParagraphNode();
        const children = this.getChildren();
        children.forEach((child) => paragraph.append(child));
        this.replace(paragraph);
        return true;
    }
}

/*
--カスタムコマンド--
*/

export type InsertNotePayload = Readonly<NotePayload>
export const INSERT_NOTE_COMMAND: LexicalCommand<InsertNotePayload> = createCommand('INSERT_NOTE_COMMAND');


export const NotePlugin = () => {

    const [editor] = useLexicalComposerContext();

    useEffect(() => {

        if (!editor.hasNodes([NoteNode])) {
            throw new Error('NoteRegister');
        }

        return mergeRegister(
            editor.registerCommand<InsertNotePayload>(INSERT_NOTE_COMMAND, (payload) => {

                const noteNode = $createNoteNode();
                $insertNodes([noteNode]);

                if ($isRootOrShadowRoot(noteNode.getParentOrThrow())) {
                    $wrapNodeInElement(noteNode, $createParagraphNode).selectEnd();
                }

                return true;
            },
                COMMAND_PRIORITY_EDITOR,
            ),

        );
    }, [editor]);

    return <>
    </>;
};