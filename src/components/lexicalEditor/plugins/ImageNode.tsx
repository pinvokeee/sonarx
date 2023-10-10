import {
    DOMExportOutput,
    EditorConfig,
    LexicalCommand,
    LexicalEditor,
    LexicalNode,
    NodeKey,
    SerializedLexicalNode,
    Spread,
    $createParagraphNode, $insertNodes, $isRootOrShadowRoot, COMMAND_PRIORITY_EDITOR,
} from 'lexical';

import { $applyNodeReplacement, DecoratorNode, createCommand } from 'lexical';
import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils';
import { Button } from '@mui/material';

export type ImageSourceType = "base64" | "link";

export type ImagePayload = {
    width?: number;
    height?: number;
    alt: string;
    key?: NodeKey;
    src: string;
    imageTypeSoruce: ImageSourceType;
}

export type SerializedImageNode = Spread<{ payload : ImagePayload }, SerializedLexicalNode>;


export class ImageNode extends DecoratorNode<JSX.Element> {

    payload: ImagePayload;

    constructor(payload : ImagePayload) {
        super(payload.key);
        // console.log(payload);
        // this.payload = { src, alt, imageTypeSoruce: sourceType, width, height, key };
        this.payload = { ...payload };
    }

    createDOM(config: EditorConfig): HTMLElement {
        const span = document.createElement("span");


        return span;
    }

    updateDOM(): false {
        return false;
    }

    decorate(): JSX.Element {

        return <BlockWithAlignableContents format={''} nodeKey={this.getKey()}
            className={{
                base: 'relative',
                focus: 'relative outline outline-indigo-300'
            }}>

            <img src=
                {this.payload.imageTypeSoruce == 'base64' ? `data:image/png;${this.payload.src}` : this.payload.src}>
            </img>

        </BlockWithAlignableContents>
    }

    exportJSON(): SerializedImageNode {
        return {
          payload: { ...this.payload },
          type: 'image',
          version: 1,
        };
      }

    static importJSON(serializedNode: SerializedImageNode): ImageNode {
        const { payload } = serializedNode;
        const node = $createImageNode(payload);
        // const nestedEditor = node.__caption;
        // const editorState = nestedEditor.parseEditorState(caption.editorState);
        // if (!editorState.isEmpty()) {
        //     nestedEditor.setEditorState(editorState);
        // }
        return node;
    }
    

    static clone(node: ImageNode): ImageNode {
        return new ImageNode({ ...node.payload });
      }

    static getType(): string {
        return 'image';
    }

}

export function $createImageNode(imagePayload: ImagePayload): ImageNode {
    return $applyNodeReplacement(new ImageNode(imagePayload));
}

/*
--カスタムコマンド--
*/

export type InsertImagePayload = Readonly<ImagePayload>
export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> = createCommand('INSERT_IMAGE_COMMAND');


export const ImagePlugin = () => {

    const [editor] = useLexicalComposerContext();

    useEffect(() => {

        if (!editor.hasNodes([ImageNode])) {
            throw new Error('ImageRegister: ImageNode not registered on editor');
        }

        console.log("TOTAL");

        return mergeRegister(
            editor.registerCommand<InsertImagePayload>(INSERT_IMAGE_COMMAND, (payload) => {

                const imageNode = $createImageNode(payload);
                $insertNodes([imageNode]);

                if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
                    $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
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


