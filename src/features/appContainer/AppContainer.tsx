import { RecoilRoot } from "recoil";
import Header from "../header/Header";
import {useDocumentSetterActions } from "../../common/states/document";
import { MainContainer } from "../mainContainer/MainContainer";



export default function AppContainer() {
    
    const { initializeState } = useDocumentSetterActions();

    return <>
        <RecoilRoot initializeState={initializeState}>
          <div className="App">
            <Header></Header>
            <MainContainer></MainContainer>
          </div>
        </RecoilRoot>
    </>
}