import { RecoilRoot } from "recoil";
import Header from "../header/Header";
import { styled } from "@mui/material";
import { useDocumentAction } from "../documentContainer/documentState";
import TreeViewer from "../documentContainer/treeViewer/TreeViewer";
import DocumentContainer from "../documentContainer/documentContainer";

const MainContainer = styled("div")(({theme}) => ({
    overflow: "auto",
    height: "100%",
    width: "100vw",
    display: "grid",
    gridTemplateColumns: "auto 1fr",
}));

export default function AppContainer() {
    
    const { initializeState } = useDocumentAction();

    return <>
        <RecoilRoot initializeState={initializeState}>
          <div className="App">
            <Header></Header>
            <MainContainer>
              <TreeViewer></TreeViewer>
              <DocumentContainer></DocumentContainer>
            </MainContainer>
          </div>
        </RecoilRoot>
    </>
}