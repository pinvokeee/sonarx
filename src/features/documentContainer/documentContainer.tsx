import { Button, styled } from "@mui/material";
import { useDocumentAction, useGetDocumentPageAction } from "./documentState";
import MonacoEditor from "../../components/monacoEditor/MonacoEditor";
import LexicalEditor from "../../components/LexicalEditor/Editor";
import { useCallback, useState } from "react";
import HtmlEditorContainer from "./HtmlEditorContainer";
// import { useDocumentAction, useGetDocumentPageAction } from "./documentState";
// import LexEditor from "../../components/lexEditor/LexEditor";
// import { Editor } from "../../components/monacoEditor/MonacoEditor";

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

export default function DocumentContainer() {

    const getDocAction = useGetDocumentPageAction();
    const viewDocumentId = getDocAction.selectedDocumentPageId;
    const page = getDocAction.useGetDocumentPage(viewDocumentId as string);
    const content = page ? page.content : "";

    const actions = useDocumentAction();

    // const aa = useDocumentAction().setSelectionDocumentPage()

    const [isChange, setIsChange] = useState(false);

    const click = () => {
        const aa = actions.newDocumentPage({ id: "te", title: "test", contentType: "html", content: "new!", parentId: undefined });
        
    }

    const handleContentChange = useCallback((value: string) =>{

        
        console.log(value);

        setIsChange(true);

    }, [])
    
    if (getDocAction.isEditableMode) {

        if (page == undefined) return <></>

        if (page.contentType == "lexHtml") {
            return <>
                <LexicalEditor></LexicalEditor>
            </>
        }

        if (page.contentType == "html") {
            return (
                <HtmlEditorContainer content={content} onContentChange={handleContentChange}></HtmlEditorContainer>
            )
        }

    }

    return <Container>
        <DocumentView srcDoc={content}></DocumentView>
        {/* <div dangerouslySetInnerHTML={{ __html: content }}></div> */}
    </Container>
}