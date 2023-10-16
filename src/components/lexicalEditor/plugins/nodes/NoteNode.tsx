import {
    DOMExportOutput,
    EditorConfig,
    LexicalCommand,
    LexicalEditor,
    LexicalNode,
    NodeKey,
    SerializedLexicalNode,
    Spread,
    $createParagraphNode, $insertNodes, $isRootOrShadowRoot, COMMAND_PRIORITY_EDITOR, ElementNode, SerializedElementNode, RangeSelection, ParagraphNode, DOMConversionMap, DOMConversionOutput, ElementFormatType, $getSelection, $isRangeSelection,
} from 'lexical';

import { $applyNodeReplacement, DecoratorNode, createCommand } from 'lexical';
import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { $wrapNodeInElement, mergeRegister, isHTMLElement } from '@lexical/utils';
import { Button, styled } from '@mui/material';
import ReactDOMServer from 'react-dom/server';
import { $setBlocksType, $getSelectionStyleValueForProperty, $patchStyleText } from '@lexical/selection';

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

function convertNoteElement(element: HTMLElement): DOMConversionOutput {
    const node = $createNoteNode();
    return { node };
}

export interface SerializedNoteNode extends SerializedElementNode {

};

export class NoteNode extends ElementNode {

    static getType(): string {
        return 'note';
    }

    static clone(node: NoteNode): NoteNode {
        return new NoteNode(node.__key);
    }

    constructor(key?: NodeKey) {
        super(key);
    }

    // View

    createDOM(config: EditorConfig): HTMLElement {
        const element = document.createElement('div');
        element.style.backgroundColor = palette["success"];
        element.style.padding = "6px";
        // addClassNamesToElement(element, config.theme.quote);
        return element;
    }
    
    updateDOM(prevNode: NoteNode, dom: HTMLElement): boolean {
        return false;
    }

    static importDOM(): DOMConversionMap | null {
        return {
            note: (node: Node) => ({
                conversion: convertNoteElement,
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

                editor.update(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) $setBlocksType(selection, () => $createNoteNode());   
                });

                // const noteNode = $createNoteNode();
                // $insertNodes([noteNode]);

                // if ($isRootOrShadowRoot(noteNode.getParentOrThrow())) {
                //     $wrapNodeInElement(noteNode, $createParagraphNode).selectEnd();
                // }

                // return true;

                return true;
            },
                COMMAND_PRIORITY_EDITOR,
            ),

        );
    }, [editor]);

    return <>
    </>;
};