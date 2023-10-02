import { Button, TextField, Toolbar, styled } from "@mui/material";
import MonacoEditor from "../../components/monacoEditor/MonacoEditor";
import { useCallback, useEffect, useState } from "react";
import { DocumentViewer } from "../../components/documentViewer/DocumentViewer";
import { IUseEdit, useEditHook } from "./hook/useEditHook";

const PreviewContainer = styled("div")(({theme}) => (
    {        
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "grid",
        gridTemplateRows: "1fr 1fr"
    }
))

const MonaContainer = styled("div")(({theme}) => (
    {
        // width: "100%",
        height: "100%",
        overflow: "hidden",
    }
));

const DocumentViewerContainer = styled("div")(({theme}) => (
    {
        borderTop: "1px solid #e0e0e0",
    }
));

export default function HtmlEditorContainer(props: { contentText: string, onChange: (value: string) => void }) 
{
    const { contentText, onChange } = props; 

    const handleChange = (value: string) => {
        onChange(value);
    }

    return (
        <>
        <PreviewContainer>
            <MonaContainer>
                <MonacoEditor value={contentText} onChange={handleChange}></MonacoEditor>
            </MonaContainer>
            <DocumentViewerContainer>
                <DocumentViewer src={contentText}></DocumentViewer>
            </DocumentViewerContainer>
        </PreviewContainer>
        </>
    );
}