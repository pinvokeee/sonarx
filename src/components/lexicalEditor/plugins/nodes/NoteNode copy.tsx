// import {
//     DOMExportOutput,
//     EditorConfig,
//     LexicalCommand,
//     LexicalEditor,
//     LexicalNode,
//     NodeKey,
//     SerializedLexicalNode,
//     Spread,
//     $createParagraphNode, $insertNodes, $isRootOrShadowRoot, COMMAND_PRIORITY_EDITOR, ElementNode, SerializedElementNode,
// } from 'lexical';

// import { $applyNodeReplacement, DecoratorNode, createCommand } from 'lexical';
// import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents';
// import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
// import { useEffect } from 'react';
// import { $wrapNodeInElement, mergeRegister } from '@lexical/utils';
// import { Button, styled } from '@mui/material';
// import ReactDOMServer from 'react-dom/server';

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

// export class NoteNode extends ElementNode {



//     payload: NotePayload;

//     constructor(payload : NotePayload) {
//         super(payload.key);
//         this.payload = { ...payload };
//     }

//     createDOM(config: EditorConfig): HTMLElement {

//         console.log(config);
// const r = <NoteNodeElement text={this.payload.text} color={palette[this.payload.type]} contentEditable />

//         const div = document.createElement("div");
//         div.innerHTML = jsxToHtml(r);

//         // console.log(jsxToHtml(r));
//         // div.innerText = this.payload.text;
//         // div.style.backgroundColor = palette[this.payload.type];
//         // div.style.padding = "12px";

//         return div;
//     }

//     updateDOM(): false {
//         return false;
//     }

//     decorate(): JSX.Element {
//         return <></>
//     }



//     // decorate(): JSX.Element {

        

//     //     return <BlockWithAlignableContents format={''} nodeKey={this.getKey()}
//     //         className={{
//     //             base: 'relative',
//     //             focus: 'relative outline outline-indigo-300'
//     //         }}>

//     //         {/* <NoteNodeElement text={this.payload.text} color={palette[this.payload.type]} contentEditable /> */}
            
//     //         {/* { this.payload.type == 'success' ? <NoteBase contentEditable>{this.payload.text}</NoteBase> :
//     //           this.payload.type == 'info' ? <NoteInfo contentEditable>{this.payload.text}</NoteInfo> :
//     //           this.payload.type == 'warn' ? <NoteWarn contentEditable>{this.payload.text}</NoteWarn> :
//     //           this.payload.type == 'error' ? <NoteError contentEditable>{this.payload.text}</NoteError> : <></>
//     //         } */}

//     //         {/* <div style={{ backgroundColor: this.palette[this.payload.type] }} contentEditable>{this.payload.text}</div> */}

//     //     </BlockWithAlignableContents>
//     // }

//     exportJSON(): SerializedElementNode {
//     return {
//         ...super.exportJSON(),
//         type: 'note',
//     };
//     }
    
//     static importJSON(serializedNode: SerializedNoteType): NoteNode {
//         const { payload } = serializedNode;
//         const node = $createNoteNode(payload);
        
//         // const nestedEditor = node.__caption;
//         // const editorState = nestedEditor.parseEditorState(caption.editorState);
//         // if (!editorState.isEmpty()) {
//         //     nestedEditor.setEditorState(editorState);
//         // }
//         return node;
//     }
    
// //     exportDOM(editor: LexicalEditor): DOMExportOutput {
        
// // }
//     static clone(node: NoteNode): NoteNode {
//         return new NoteNode({ ...node.payload });
//       }

//     static getType(): string {
//         return 'note';
//     }

// }

// export function $createNoteNode(notePayload: NotePayload): NoteNode {
//     return $applyNodeReplacement(new NoteNode(notePayload));
// }

// /*
// --カスタムコマンド--
// */

// export type InsertNotePayload = Readonly<NotePayload>
// export const INSERT_NOTE_COMMAND: LexicalCommand<InsertNotePayload> = createCommand('INSERT_IMAGE_COMMAND');


// export const NotePlugin = () => {

//     const [editor] = useLexicalComposerContext();

//     useEffect(() => {

//         if (!editor.hasNodes([NoteNode])) {
//             throw new Error('NoteRegister');
//         }

//         return mergeRegister(
//             editor.registerCommand<InsertNotePayload>(INSERT_NOTE_COMMAND, (payload) => {

//                 const noteNode = $createNoteNode(payload);
//                 $insertNodes([noteNode]);

//                 if ($isRootOrShadowRoot(noteNode.getParentOrThrow())) {
//                     $wrapNodeInElement(noteNode, $createParagraphNode).selectEnd();
//                 }

//                 return true;
//             },
//                 COMMAND_PRIORITY_EDITOR,
//             ),

//         );
//     }, [editor]);

//     return <>
//     </>;
// };

export default {}

