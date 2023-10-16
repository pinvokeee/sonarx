import {
    DOMExportOutput,
    EditorConfig,
    LexicalCommand,
    LexicalEditor,
    LexicalNode,
    NodeKey,
    SerializedLexicalNode,
    Spread,
    $createParagraphNode, $insertNodes, $isRootOrShadowRoot, COMMAND_PRIORITY_EDITOR, ElementNode, SerializedElementNode, isHTMLElement,
} from 'lexical';

import { $applyNodeReplacement, DecoratorNode, createCommand } from 'lexical';
import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils';
import { Button, styled } from '@mui/material';
import ReactDOMServer from 'react-dom/server';
import Flow from '../../../../features/documentContainer/FlowEditor';

// export type NoteType = "success" | "info" | "warn" | "error";

// export type NotePayload = {
//     key?: NodeKey;
//     type: NoteType;
//     text: string;
// }
// export type SerializedNoteType = Spread<{ payload : NotePayload }, SerializedLexicalNode>;

// const palette = {
//         "success": "#e3f7df",
//         "info": "#fdf9e2",
//         "warn": "#fdf9e2",
//         "error":  "#feebee",
//     }

// // const NoteSuccess = styled("div")(({theme}) => (
// //     {
// //         padding: "12px",
// //         backgroundColor: palette.success,
// //     }
// // ));

// // const NoteInfo = styled("div")(({theme}) => (
// //     {
// //         padding: "12px",
// //         backgroundColor: palette.info,
// //     }
// // ));

// // const NoteWarn = styled("div")(({theme}) => (
// //     {
// //         padding: "12px",
// //         backgroundColor: palette.warn,
// //     }
// // ));


// // const NoteError = styled("div")(({theme}) => (
// //     {
// //         padding: "12px",
// //         backgroundColor: palette.error,
// //     }
// // ));


// function jsxToHtml(jsx: React.ReactElement): string {
//     return ReactDOMServer.renderToStaticMarkup(jsx);
//     }

// const NoteBase = styled("div")(({theme}) => (
//     {
//         padding: "12px",
//     }
// ));

// const NoteNodeElement = (props: { text: string, color: string, contentEditable?: boolean }) => {

//     return  <NoteBase contentEditable={props.contentEditable ?? false} style={{ backgroundColor: props.color }}>{props.text}</NoteBase>
// }


export type FlowPayload = {
    key?: NodeKey;
    // nodes: Node[],
    // edges: Edge[],
}


function jsxToHtml(jsx: React.ReactElement): string {
    return ReactDOMServer.renderToStaticMarkup(jsx);
    }
export type SerializedReactFlowNode = Spread<{ payload : FlowPayload }, SerializedLexicalNode>;

export class ReactFlowNode extends DecoratorNode<JSX.Element> {

    payload: FlowPayload;

    constructor(payload : FlowPayload) {
        super(payload.key);
        console.log(payload);
        this.payload = { ...payload };
    }

    createDOM(config: EditorConfig): HTMLElement {

        const div = document.createElement("div");
        // div.innerHTML = jsxToHtml(this.decorate());

        // console.log(jsxToHtml(r));
        // div.innerText = this.payload.text;
        // div.style.backgroundColor = palette[this.payload.type];
        // div.style.padding = "12px";

        return div;
    }

    updateDOM(): false {
        return false;
    }

    decorate(): JSX.Element {

        return (<BlockWithAlignableContents format={''} nodeKey={this.getKey()}
            className={{
                base: 'relative',
                focus: 'relative outline outline-indigo-300'
            }}>
                <div style={{ width: "100%", height: "100px", }}>
                    <Flow></Flow>
                </div>
        
        </BlockWithAlignableContents>)
    }


    exportJSON(): SerializedReactFlowNode {
        return {
            payload: { ...this.payload },
            type: 'reactflow',
            version: 1,
        };
    }

    exportDOM(editor: LexicalEditor): DOMExportOutput {
        const {element} = super.exportDOM(editor);
        console.log(element);
        if (element && isHTMLElement(element)) {
            element.innerHTML = "test<b>test</b>";
            // element.innerHTML = jsxToHtml(this.decorate());

            console.log(element);


        //   if (this.isEmpty()) element.append(document.createElement('br'));
    
        //   const formatType = this.getFormatType();
        //   element.style.textAlign = formatType;
    
        //   const direction = this.getDirection();
        //   if (direction) {
            // element.dir = direction;
        //   }
        }
    
        return {
          element,
        };
    }
    
    static importJSON(serializedNode: SerializedReactFlowNode): ReactFlowNode {
        const { payload } = serializedNode;
        const node = $createReactFlowNode(payload);
        
        // const nestedEditor = node.__caption;
        // const editorState = nestedEditor.parseEditorState(caption.editorState);
        // if (!editorState.isEmpty()) {
        //     nestedEditor.setEditorState(editorState);
        // }
        return node;
    }
    
    static clone(node: ReactFlowNode): ReactFlowNode {
        return new ReactFlowNode({ ...node.payload });
      }

    static getType(): string {
        return 'reactflow';
    }

}

export function $createReactFlowNode(flowPayload: FlowPayload): ReactFlowNode {
    return $applyNodeReplacement(new ReactFlowNode(flowPayload));
}

// /*
// --カスタムコマンド--
// */

export type InsertReactFlowPayload = Readonly<FlowPayload>
export const INSERT_REACTFLOW_COMMAND: LexicalCommand<InsertReactFlowPayload> = createCommand('INSERT_REACTFLOW_COMMAND');

export const ReactFlowPlugin = () => {

    const [editor] = useLexicalComposerContext();

    useEffect(() => {

        if (!editor.hasNodes([ReactFlowNode])) {
            throw new Error('NoteRegister');
        }

        return mergeRegister(
            editor.registerCommand<InsertReactFlowPayload>(INSERT_REACTFLOW_COMMAND, (payload) => {

                const noteNode = $createReactFlowNode(payload);
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

export default {}

