import { MutableSnapshot, atom, atomFamily, selectorFamily, useRecoilCallback, useRecoilValue } from "recoil";
import { AtomKeys } from "../../common/atomKeys";
import { DocumentPage, IdDictionary, IdParentPair } from "../../common/types";


const documentsState = atomFamily<DocumentPage, string>({
    key: AtomKeys.DOCUMENT.ACTION.PAGES,
    default: undefined
})

const documentIdState = atom<IdDictionary>({
    key: AtomKeys.DOCUMENT.ACTION.KEYS,
    default: {},
})

const documentSelectDivision = atom<string | undefined>({
    key: AtomKeys.DOCUMENT.ACTION.SELECTIONDIV,
    default: undefined,
})

const documentSelection = atom<string | undefined>({
    key: AtomKeys.DOCUMENT.ACTION.SELECTION,
    default: undefined,
})

const documentEditableMode = atom<boolean>({
    key: AtomKeys.DOCUMENT.EDIT,
    default: true,
})


export const useDocumentAction = () => {

    const a = useRecoilCallback(({ snapshot }) => () => {
        
        const ids = snapshot.getLoadable(documentIdState).contents;
        const pages = Object.keys(ids).map(id => snapshot.getLoadable(documentsState(id)).contents);

        console.log(JSON.stringify(pages));
    });

    const initializeState = ({ set }: MutableSnapshot) => {
        
        // @ts-ignore
        const pages = sheet;

        pages.forEach((p: DocumentPage) => {
            const newPage : DocumentPage = { ...p, id: p.id == "" ? crypto.randomUUID() : p.id };
            set(documentIdState, prev => ({...prev, [newPage.id]: { parentId: newPage.parentId } }));
            set(documentsState(newPage.id), newPage);
        });
    }

    const setSelectionDivison = useRecoilCallback(({ set }) => (id: string | undefined) => {
        set(documentSelectDivision, prev => id);
    });

    const setSelectionDocumentPage = useRecoilCallback(({ set }) => (id: string) => {
        set(documentSelection, prev => id);
    });

    const newDocumentPage = useRecoilCallback(({ set }) => ( doc: DocumentPage) => 
    {        
        const newPage : DocumentPage = { ...doc, id: doc.id == "" ? crypto.randomUUID() : doc.id };
        set(documentIdState, prev => ({...prev, [newPage.id]: { parentId: newPage.parentId } }));
        set(documentsState(newPage.id), newPage);
        return newPage;
    })

    return {
        initializeState,
        newDocumentPage,
        setSelectionDivison,
        setSelectionDocumentPage,
        
        a,
    }
}

const getDocumentPage = selectorFamily<DocumentPage, string>({
  key: AtomKeys.DOCUMENT.SELECTOR.PAGES,
  get: id => ({ get }) => get(documentsState(id)),
})

export const useGetDocumentPageAction = () => {

    const documentIds = useRecoilValue(documentIdState);
    const useGetDocumentPage = (id: string) => useRecoilValue(getDocumentPage(id));
    const selectedDivisionId = useRecoilValue(documentSelectDivision);
    const selectedDocumentPageId = useRecoilValue(documentSelection);

    const isEditableMode = useRecoilValue(documentEditableMode);

    return {
        documentIds, 
        selectedDocumentPageId,
        selectedDivisionId,
        useGetDocumentPage,
        isEditableMode,
    }
}
