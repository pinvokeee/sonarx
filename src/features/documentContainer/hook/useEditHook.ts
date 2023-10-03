import { useEffect, useState } from "react";
import { useWysiwygState } from "./useWysiwyg";
import { EditorState, LexicalEditor } from "lexical";
import { DocumentPage, IReturnState } from "../../../common/types";
import { useDocumentSetterActions, useDocuments } from "../../../common/states/document";

export type IUseEdit = {
    contentText: string,
    editPage: DocumentPage | undefined,
    isEditableMode: boolean,
    applyDocumentPage: (newPage: DocumentPage) => Promise<void>,
    onChange: (value: string) => void,
    onChangeWysiwyg: (editor: LexicalEditor, editorState: EditorState) => void
}

export const useEditHook = (props: { documentId: string }) : IUseEdit => {

    console.log("CALL HOOK");

    const id = props.documentId;
    const { useGetFromId, isEditableMode, pages } = useDocuments();
    const { setDocumentPage } = useDocumentSetterActions();

    const useWsiywyg = useWysiwygState();

    const editPage = { ...useGetFromId(id as string) }
    const [contentText, setContentText] = useState(editPage.content);

    useEffect(() => setContentText(editPage.content), [props.documentId]);

    const onChange = (value: string) => {
        setContentText(value);
    }

    const applyDocumentPage = async (newPage: DocumentPage) : Promise<void> => {

        const saveContent = await getContentText();
        const returnState : IReturnState = { errorItem: "", isError: false, message: "" };

        // if (newPage.contentType == "lexHtml" && !(await useWsiywyg.tryToFormattedText(saveContent))) {
        //     return { errorItem: "ソースコード", message: "この形式は書式付きテキストに変換できません", isError: true };
        // }

        setDocumentPage({ ...newPage, content: saveContent });

        // return returnState;
    }

    const getContentText = async () => {
        
        if (editPage.contentType == "lexHtml") {
            const text = await useWsiywyg.getEditState();
            setContentText(text);
            return text;
        }

        return contentText;
    }

    return {
        contentText,
        applyDocumentPage,

        onChange,
        onChangeWysiwyg: useWsiywyg.onChange, 
        
        editPage,

        isEditableMode,

    } as IUseEdit
}