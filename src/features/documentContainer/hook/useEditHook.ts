import { useEffect, useState } from "react";
import { useWysiwygState } from "./useWysiwyg";
import { EditorState, LexicalEditor } from "lexical";
import { DocumentPage, IReturnState } from "../../../common/types";
import { useDocumentSetterActions, useDocuments } from "../../../common/states/document";

export type IUseEdit = {
    content: IContent,
    editPage: DocumentPage | undefined,
    isEditableMode: boolean,
    applyDocumentPage: (newPage: DocumentPage) => Promise<void>,
    onChange: (value: string) => void,
    onChangeWysiwyg: (editor: LexicalEditor, editorState: EditorState) => void,

    isTemporarySaving: () => boolean,
}

type IContent = {
    text: string, 
    html: string | undefined
}

export const useEditHook = (props: { documentId: string }) : IUseEdit => {

    const id = props.documentId;
    const { useGetFromId, isEditableMode, pages } = useDocuments();
    const { setDocumentPage } = useDocumentSetterActions();

    const useWsiywyg = useWysiwygState( { documentId: id });

    const editPage = { ...useGetFromId(id as string) }
    const [contentText, setContentText] = useState<IContent>({ text: editPage.text, html: editPage.html });

    const temporaryContent = localStorage.getItem(id);

    const isTemporarySaving = () => {
        return temporaryContent != null;
    }

    const onChange = (text: string) => {
        setContentText(content => ({ ...content, text }));
    }

    const applyDocumentPage = async (newPage: DocumentPage) : Promise<void> => {
        const saveContent = await getContentText();
        setDocumentPage({ ...newPage, text: saveContent.text, html: saveContent.html });
    }

    const getContentText = async () => {

        if (editPage.contentType == "lexHtml") {
            const text = await useWsiywyg.getEditState();
            const html = await useWsiywyg.getHtmlString();
            const content = { text, html };
            setContentText(content);
            return content;
        }

        return { ...contentText, html: undefined };
    }

    return {
        content: contentText,
        applyDocumentPage,

        onChange,
        onChangeWysiwyg: useWsiywyg.onChange, 
        editPage,

        isEditableMode,
        isTemporarySaving,
    } as IUseEdit
}