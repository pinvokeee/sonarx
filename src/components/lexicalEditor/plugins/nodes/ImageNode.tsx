import {
    DOMExportOutput,
    EditorConfig,
    LexicalCommand,
    LexicalEditor,
    LexicalNode,
    NodeKey,
    SerializedLexicalNode,
    Spread,
    $createParagraphNode, $insertNodes, $isRootOrShadowRoot, COMMAND_PRIORITY_EDITOR, isHTMLElement, ElementNode, SerializedElementNode, PASTE_COMMAND, DOMConversionMap, COMMAND_PRIORITY_LOW, DRAGSTART_COMMAND, COMMAND_PRIORITY_HIGH, DRAGOVER_COMMAND, DROP_COMMAND, $getSelection, $isNodeSelection, $createRangeSelection, $setSelection, $getNodeByKey, $isRangeSelection, RangeSelection,
} from 'lexical';

import { DRAG_DROP_PASTE } from '@lexical/rich-text';
import { $applyNodeReplacement, DecoratorNode, createCommand } from 'lexical';
import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useRef, useState } from 'react';
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

export type SerializedImageNode = Spread<{ payload: ImagePayload }, SerializedLexicalNode>;

const ResizeHandle = (props: { children: React.ReactNode, onResize?: (newWidth: number, newHeight: number) => void }) => {

    const [dragState, setDragState] = useState<{ isDrag: boolean, x: number, y: number }>({ isDrag: false, x: 0, y: 0 });

    const handleDragStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setDragState(state => ({...state, isDrag: true, x: e.screenX, y: e.screenY}) );
    }

    const handleDragOver = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setDragState(state => ({...state, isDrag: false, x: e.screenX, y: e.screenY}) );
    }

    const handleDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {

        if (dragState.isDrag) {

            const newX = e.screenX, newY = e.screenY;
            const oldX = dragState.x, oldY = dragState.y;

            console.log(newX - oldX, newY - oldY);

            props.onResize?.call(undefined, newX - oldX, newY - oldY);
        }
    }

    return <div style={{ width:"fit-content" , position: "relative" }}>
        {props.children}
        <div onMouseDown={handleDragStart} onMouseUp={handleDragOver} onMouseMove={handleDrag}  style={{ backgroundColor: "#7f7f7f7f", height: "100%", position: "absolute", left: "calc(100% + 10px)", top: "0px", borderRadius: "4px", width: "5px" }}>
        </div>
    </div>
}

const ImageComponent = (props: { src: string, width?: number, height?: number, onResize?: (width: number, height: number) => void }) => {
 
    const r = useRef<HTMLDivElement>(null);
    const [isFocus, setFocus] = useState(false);

    const focus = () => setFocus(true);
    const blur = () => setFocus(false);

    const handleResize = (x: number, y: number) => {
        if (props.onResize) props.onResize(x, y);
    }

    return <>
        {/* <div ref={r} tabIndex={0} onFocus={focus} onBlur={blur}> */}
        <ResizeHandle onResize={handleResize}>
            <div>
                <img src={props.src} style={{ width: props.width, height: props.height, verticalAlign: "middle", }}></img>
            </div>

        </ResizeHandle>
        {/* </div> */}
    </>
}

export class ImageNode extends DecoratorNode<JSX.Element> {
    // export class ImageNode extends ElementNode {


    payload: ImagePayload;

    constructor(payload: ImagePayload) {
        super(payload.key);
        // console.log(payload);
        // this.payload = { src, alt, imageTypeSoruce: sourceType, width, height, key };
        this.payload = { ...payload,  };
    }

    createDOM(config: EditorConfig): HTMLElement {

        const div = document.createElement("div");
        // const img = document.createElement("img");
        // img.src = this.payload.src;
        div.style.userSelect = "none";
        // div.draggable = true;
        // div.appendChild(img);
        return div;
    }

    updateDOM(): false {
        return false;
    }

    decorate(): JSX.Element {

        const { src, imageTypeSoruce, width, height } = this.payload;
        const s = imageTypeSoruce == 'base64' ? `data:image/png;${src}` : src;

        return (<BlockWithAlignableContents format={''} nodeKey={this.getKey()}
            className={{
                base: 'relative',
                focus: 'relative outline outline-indigo-300'
            }}>

                <ImageComponent src={s} width={width} height={height} onResize={this.handleResize} />
                {/* <img src=
                    {this.payload.imageTypeSoruce == 'base64' ? `data:image/png;${this.payload.src}` : this.payload.src}>
                </img> */}

        </BlockWithAlignableContents>);
    }

    handleResize = (x: number, y: number) => {
        console.log(this);
        this.payload.width = (this.payload.width ?? 0) + x;
        this.payload.height = (this.payload.height ?? 0) + y;
        // this.payload = { ...this.payload, width: (this.payload.width ?? 0) + x, height: (this.payload.height ?? 0) + y };
    }

    exportJSON(): SerializedImageNode {
        return {
            payload: { ...this.payload },
            type: 'image',
            version: 1,
        };
    }

    // exportJSON(): SerializedElementNode  {

    //     return {
    //         ...super.exportJSON(),
    //         type: 'image',
    //       };

    //     // return {
    //     //   payload: { ...this.payload },
    //     //   type: 'image',
    //     //   version: 1,
    //     // };
    //   }

    exportDOM(editor: LexicalEditor): DOMExportOutput {
        const { element } = super.exportDOM(editor);

        if (element && isHTMLElement(element)) {
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

    static importDOM() : DOMConversionMap | undefined {
        return {
            img: (node: Node) => ({
                conversion: createImageElementFromDomNode,
                priority: 0,
            }),
        }
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

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
    return node instanceof ImageNode;
}

const createImageElementFromDomNode = (domNode: Node) => {

    if (domNode instanceof HTMLImageElement) {
        const { alt, src } = domNode;
        const node = $createImageNode({ alt, src, imageTypeSoruce: "link" });
        return { node }
    }

    return null;
}

export function $createImageNode(imagePayload: ImagePayload): ImageNode {
    return $applyNodeReplacement(new ImageNode(imagePayload));
}

export const imageBinToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        console.log(file);
        fr.onloadend = () => resolve((fr.result as string) ?? "")
        fr.readAsDataURL(file);
    });
}

export const imageBinToBase64Size = (file: File): Promise<{ base64 : string, width: number, height: number }> => {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        
        fr.onloadend = async () => {

            const img = new Image();
            img.onload = () => {
                resolve(({ base64: img.src, width: img.naturalWidth, height: img.naturalHeight }))
            }

            img.src = fr.result as string ?? "";
        }

        fr.readAsDataURL(file);
    });
}


const createImagePayloadFromImageElement = (img: HTMLImageElement) : ImagePayload => {
    return {
        src: img.src,
        alt: img.alt,
        imageTypeSoruce: "base64",
    }
}

/*
--カスタムコマンド--
*/

export type InsertImagePayload = Readonly<ImagePayload>
export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> = createCommand('INSERT_IMAGE_COMMAND');

let a : HTMLImageElement | undefined = undefined;

export const ImagePlugin = () => {

    const [editor] = useLexicalComposerContext();
    const [selectImageNode, setSelectedImageNode] = useState<HTMLImageElement>();
    const [imagePayload, setImagePayload] = useState<InsertImagePayload>();

    useEffect(() => {

        editor.registerCommand<File[]>(DRAG_DROP_PASTE, (files) => {

            if (files.length == 0) return true;

            const file = files[0].name;
            // const bin = files.map(async (file) => await imageBinToBase64(file));

            imageBinToBase64Size(files[0]).then(result => {
                editor.dispatchCommand(INSERT_IMAGE_COMMAND,
                    {
                        alt: file,
                        imageTypeSoruce: "base64",
                        src: result.base64,
                        width: result.width,
                        height: result.height,
                    }
                );
            })

            return true;

        }, COMMAND_PRIORITY_LOW);


    }, []);

    useEffect(() => {

        if (!editor.hasNodes([ImageNode])) {
            throw new Error('ImageRegister: ImageNode not registered on editor');
        }

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

            editor.registerCommand<DragEvent>(DRAGSTART_COMMAND, (event) => {




                    // // const node = event.target as HTMLElement;
                    // const node : HTMLImageElement = event.target as HTMLImageElement;
               
                    // if (node) {
                    //     // console.log(node);
                    //     // const payload = createImagePayloadFromImageElement(node);
                    //     // setImagePayload(payload);
                    //     setSelectedImageNode(node);

                    // }

                    return true;
                    // return onDragStart(event);
                },
                COMMAND_PRIORITY_HIGH,
            ),
            editor.registerCommand<DragEvent>(DRAGOVER_COMMAND, (event) => {

                const node : HTMLImageElement = event.target as HTMLImageElement;

                // console.log(node);

                // if (selectImageNode) {
                //     selectImageNode.remove();
                // }

                    return true;
                    // return onDragover(event);
                },
                COMMAND_PRIORITY_LOW,
            ),

            editor.registerCommand<DragEvent>(DROP_COMMAND, (event) => {
                
                // const d = $getSelection() as RangeSelection;

                // if ($isRangeSelection(d)) {
                //     console.log($getNodeByKey(d.anchor.key)?.remove());
                // }

                // console.log(selectImageNode, a, event);

                // if (a) {
                //     console.log(a);
                //     a.remove();
                // }

                // if (selectImageNode) {
                //     selectImageNode.remove();
                //     // editor.dispatchCommand(INSERT_IMAGE_COMMAND, imagePayload);
                // }

                return true;
                    // return onDrop(event, editor);
                },
                COMMAND_PRIORITY_HIGH,
            ),
        );
    }, [editor]);

    return <>
    </>;
};

export const CAN_USE_DOM: boolean =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined';

const getDOMSelection = (targetWindow: Window | null): Selection | null =>
  CAN_USE_DOM ? (targetWindow || window).getSelection() : null;


const TRANSPARENT_IMAGE =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const img = document.createElement('img');
img.src = TRANSPARENT_IMAGE;

function onDragStart(event: DragEvent): boolean {
    const node = getImageNodeInSelection();
    if (!node) {
        return false;
    }
    const dataTransfer = event.dataTransfer;
    if (!dataTransfer) {
        return false;
    }
    dataTransfer.setData('text/plain', '_');
    dataTransfer.setDragImage(img, 0, 0);
    dataTransfer.setData(
        'application/x-lexical-drag',
        JSON.stringify({
            data: {
                altText: node.__altText,
                caption: node.__caption,
                height: node.__height,
                key: node.getKey(),
                maxWidth: node.__maxWidth,
                showCaption: node.__showCaption,
                src: node.__src,
                width: node.__width,
            },
            type: 'image',
        }),
    );

    return true;
}

function onDragover(event: DragEvent): boolean {
    const node = getImageNodeInSelection();
    if (!node) {
        return false;
    }
    if (!canDropImage(event)) {
        event.preventDefault();
    }
    return true;
}

function onDrop(event: DragEvent, editor: LexicalEditor): boolean {
    const node = getImageNodeInSelection();
    if (!node) {
        return false;
    }
    const data = getDragImageData(event);
    if (!data) {
        return false;
    }
    event.preventDefault();
    if (canDropImage(event)) {
        const range = getDragSelection(event);
        node.remove();
        const rangeSelection = $createRangeSelection();
        if (range !== null && range !== undefined) {
            rangeSelection.applyDOMRange(range);
        }
        $setSelection(rangeSelection);
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, data);
    }
    return true;
}

function getImageNodeInSelection(): ImageNode | null {
    const selection = $getSelection();
    if (!$isNodeSelection(selection)) {
        return null;
    }
    const nodes = selection.getNodes();
    const node = nodes[0];
    return $isImageNode(node) ? node : null;
}

function getDragImageData(event: DragEvent): null | InsertImagePayload {
    const dragData = event.dataTransfer?.getData('application/x-lexical-drag');
    if (!dragData) {
        return null;
    }
    const { type, data } = JSON.parse(dragData);
    if (type !== 'image') {
        return null;
    }

    return data;
}

declare global {
    interface DragEvent {
        rangeOffset?: number;
        rangeParent?: Node;
    }
}

function canDropImage(event: DragEvent): boolean {
    const target = event.target;
    return !!(
        target &&
        target instanceof HTMLElement &&
        !target.closest('code, span.editor-image') &&
        target.parentElement &&
        target.parentElement.closest('div.ContentEditable__root')
    );
}

function getDragSelection(event: DragEvent): Range | null | undefined {
    let range;
    const target = event.target as null | Element | Document;
    const targetWindow =
        target == null
            ? null
            : target.nodeType === 9
                ? (target as Document).defaultView
                : (target as Element).ownerDocument.defaultView;
    const domSelection = getDOMSelection(targetWindow);
    if (document.caretRangeFromPoint) {
        range = document.caretRangeFromPoint(event.clientX, event.clientY);
    } else if (event.rangeParent && domSelection !== null) {
        domSelection.collapse(event.rangeParent, event.rangeOffset || 0);
        range = domSelection.getRangeAt(0);
    } else {
        throw Error(`Cannot get the selection when dragging`);
    }

    return range;
}