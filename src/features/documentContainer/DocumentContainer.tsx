import { styled } from "@mui/material";
import { memo, useEffect, useMemo } from "react";
import HtmlEditorContainer from "./HtmlEditorContainer";
import { useDocumentSetterActions, useDocuments } from "../../common/states/document";
import { DocumentPage, IReturnState } from "../../common/types";
import { PropertyEditor } from "./PropertyEditor";
import { useWysiwygState } from "./hook/useWysiwyg";
import { useEditHook } from "./hook/useEditHook";
import WysiwygEditor from "./WysiwygEditor";
import Flow from "./FlowEditor";

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

export const DocumentContainer = ( props: { documentId: string } ) => {

    const useEdit = useEditHook( { documentId: props.documentId });
    const { isEditableMode, applyDocumentPage, editPage, content: contentText, onChange, onChangeWysiwyg, isTemporarySaving } = useEdit;

    const handleSaveProperty = async (newPage: DocumentPage) => {
        await applyDocumentPage(newPage);
    } 

    const getEditComponent = (type: string) => {

        if (type == "flow") return (
            <Flow></Flow>
        );
        
        if (type == "lexHtml") return (
            <WysiwygEditor contentText={contentText.text} isEditable={isEditableMode} onChangeWysiwyg={onChangeWysiwyg}></WysiwygEditor>
        );
        
        if (type == "html") return (
            <HtmlEditorContainer contentText={contentText.text} onChange={onChange}></HtmlEditorContainer>
        );
    }


    // const isEditableMode = false;
    // const editPage = { contentType: "html" };

    // if (isEditableMode) {

        if (editPage == undefined) return <></>

        return <>
        <EditContainer>
            { getEditComponent(editPage.contentType) }
            { isEditableMode ?
                <PropertyEditor key={editPage.id} page={editPage} onSave={handleSaveProperty}></PropertyEditor>
                : <></>
            }
        </EditContainer>
        </>
    // }

    // return <Container>
    //     <DocumentView srcDoc={ editPage?.contentType == "lexHtml" ? editPage.html : editPage?.text}></DocumentView>
    // </Container>
}


// export const DocumentContainer = memo(_DocumentContainer);
