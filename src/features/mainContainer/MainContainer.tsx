import { styled } from "@mui/material";
import { useDocuments } from "../../common/states/document";
import TreeViewer from "./treeViewer/TreeViewer";
import DocumentContainer from "../documentContainer/DocumentContainer";

const Container = styled("div")(({theme}) => ({
    overflow: "auto",
    height: "100%",
    width: "100vw",
    display: "grid",
    gridTemplateColumns: "auto 1fr",
}));

export function MainContainer() {

    const { selectedPageId } = useDocuments();

    return <>
        <Container>
            <TreeViewer></TreeViewer>
            <DocumentContainer documentId={selectedPageId as string}></DocumentContainer>
        </Container>
    </>
}