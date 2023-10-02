import { styled } from "@mui/material";
import { useEffect } from "react";
import HtmlEditorContainer from "./HtmlEditorContainer";
import { useDocumentSetterActions, useDocuments } from "../../common/states/document";
import { DocumentPage, IReturnState } from "../../common/types";
import { PropertyEditor } from "./PropertyEditor";
import { useWysiwygState } from "./hook/useWysiwyg";
import { useEditHook } from "./hook/useEditHook";
import WysiwygEditor from "./WysiwygEditor";

const Container = styled("div")(({theme}) => (
    {
        width: "100%",
        height: "100%",
    }
));

const DocumentView = styled("iframe")(({theme}) => (
    {
        width: "100%",
        height: "100%",
        border: "none",
    }
));

const EditContainer = styled("div")(({theme}) => (
    {
        height: "100%",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "1fr auto",
    }
));

export default function DocumentContainer( props: { documentId: string } ) {

    console.log("RENDER", "DOC");

    const useEdit = useEditHook( { documentId: props.documentId });
    const { isEditableMode, applyDocumentPage, editPage, contentText, onChange, onChangeWysiwyg } = useEdit;

    const handleSaveProperty = async (newPage: DocumentPage) => {
        await applyDocumentPage(newPage);
    } 

    const getEditComponent = (type: string) => {

        if (type == "lexHtml") return (
            <WysiwygEditor contentText={contentText} onChangeWysiwyg={onChangeWysiwyg}></WysiwygEditor>
        );
        
        if (type == "html") return (
            <HtmlEditorContainer contentText={contentText} onChange={onChange}></HtmlEditorContainer>
        );
    }

    if (isEditableMode) {

        if (editPage == undefined) return <></>

        return <>
        <EditContainer>
            { getEditComponent(editPage.contentType) }
            <PropertyEditor key={editPage.id} page={editPage} onSave={handleSaveProperty}></PropertyEditor>
        </EditContainer>
        </>
    }

    return <Container>
        <DocumentView srcDoc={editPage?.content}></DocumentView>
    </Container>
}