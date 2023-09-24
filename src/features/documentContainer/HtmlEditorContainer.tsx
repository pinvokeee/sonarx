import { styled } from "@mui/material";
import MonacoEditor from "../../components/monacoEditor/MonacoEditor";

const MonaContainer = styled("div")(({theme}) => (
    {
        width: "100%",
        height: "100%",
        overflow: "hidden",
    }
));



type HtmlEditorContainerProps = {
    content: string,
    onContentChange: (value: string) => void,
}

export default function HtmlEditorContainer(props: HtmlEditorContainerProps) {
    
    return (
        <>
        <ToolBar></ToolBar>
        <MonaContainer>
        {/* <Button onClick={click}>aatest</Button> */}
        <MonacoEditor value={props.content} handleContentChange={props.onContentChange}></MonacoEditor>
        </MonaContainer>
        </>

    );
}