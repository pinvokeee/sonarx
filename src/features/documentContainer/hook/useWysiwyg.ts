import { EditorState, LexicalEditor } from "lexical";
import { useState } from "react";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";

export const useWysiwygState = (props: { documentId: string }) => {

    const [editorState, setEditorState] = useState<EditorState | undefined>(undefined);
    const [editorComponent, setEditorComponent] = useState<LexicalEditor | undefined>(undefined);
    const documentId = props.documentId;

    const onChange = (editor: LexicalEditor, editorState: EditorState) => {
        setEditorComponent(editor);
        setEditorState(editorState);

        // localStorage.setItem(documentId, JSON.stringify(editorState ?? ""))
    }

    const getEditState = async () => {
        return new Promise<string>((resolve, reject) => {

            if (!editorComponent) resolve("");
            resolve(JSON.stringify(editorComponent?.getEditorState() ?? ""));

            // editorState?.read(() => {
            //     if (editorComponent) {
            //         resolve($generateHtmlFromNodes(editorComponent, undefined))
            //     }
            // });
        });
    }

    const getHtmlString = async () => {
        return new Promise<string>((resolve, reject) => {
            editorState?.read(() => {
                if (editorComponent) {
                    resolve($generateHtmlFromNodes(editorComponent, undefined))
                }
            });
        });
    }

    const tryToFormattedText = async (content: string) => {

        if (!editorComponent) return false;

        return new Promise<boolean>((resolve, reject) => {
            editorComponent.update(() => {
                try
                {
                    const parser = new DOMParser();
                    const textHtmlMimeType: DOMParserSupportedType = 'text/html';
                    const dom = parser.parseFromString(content, textHtmlMimeType);
                    const nodes = $generateNodesFromDOM(editorComponent, dom);

                    resolve(true);
                }
                catch (ex: any)
                {
                    console.log(ex);
                    resolve(false);
                }
            })
        });
    }

    return {
        onChange,
        getEditState,
        getHtmlString,
        tryToFormattedText,
    }
}
