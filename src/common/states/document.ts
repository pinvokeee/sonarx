import { atomFamily, atom, selectorFamily, selector, MutableSnapshot, useRecoilCallback, useRecoilValue } from "recoil"
import { AtomKeys } from "../keys"
import { DocumentPage, IdDictionary } from "../types"

/**
 * Atom定義
 */
const documentsState = atomFamily<DocumentPage, string>({
    key: AtomKeys.DOCUMENT.ACTION.PAGES,
    default: undefined
})

const documentIdState = atom<string[]>({
    key: AtomKeys.DOCUMENT.ACTION.KEYS,
    default: [],
})

// const documentIdState = atom<IdDictionary>({
//     key: AtomKeys.DOCUMENT.ACTION.KEYS,
//     default: {},
// })

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

/**
 * Selector定義
 */
const getDocumentSelectorFromId = selectorFamily<DocumentPage, string>({
    key: AtomKeys.DOCUMENT.SELECTOR.PAGEFORID,
    get: id => ({ get }) => get(documentsState(id)),
})

const getDocumentSelector = selector<{[key: string]: DocumentPage}>({    
    key: AtomKeys.DOCUMENT.SELECTOR.PAGES,
    get: ({ get }) =>  {
        const id = get(documentIdState);
        const pages = Object.fromEntries(Object.keys(id).map(_id => [_id, get(getDocumentSelectorFromId(_id))]));
        return pages;
    }
})

/**
 * カスタムフック定義
 */

export const useDocuments = () => {

    const idList = useRecoilValue(documentIdState);

    const useGetFromId = (id: string) => useRecoilValue(getDocumentSelectorFromId(id));

    const pages = useRecoilValue(getDocumentSelector);
    const getAllPages = () => useRecoilValue(getDocumentSelector);

    const selectedDivisionId = useRecoilValue(documentSelectDivision);
    const selectedPageId = useRecoilValue(documentSelection);

    const useGetSelectedDocumentPage = () => {

        const id = useRecoilValue(documentSelection);
        if (id == undefined) return undefined;

        return useRecoilValue(getDocumentSelectorFromId(id));
    }

    const isEditableMode = useRecoilValue(documentEditableMode);

    return {
        idList, 
        selectedPageId,
        selectedDivisionId,
        useGetFromId,
        useGetSelectedDocumentPage,
        isEditableMode,
        pages,
        // getAllPages,
    }
}


export const useDocumentSetterActions = () => {

    const convertToJSON = useRecoilCallback(({ snapshot }) => () => {
        
        const ids = snapshot.getLoadable(documentIdState).contents;
        const pages = Object.keys(ids).map(id => snapshot.getLoadable(documentsState(id)).contents);

        return JSON.stringify(pages);
    });

    const initializeState = ({ set }: MutableSnapshot) => {
        
        // @ts-ignore
        const pages = sheet;
        const params = new URL(window.location.href).searchParams;
        const docId = params.get("doc") ?? "";
        const divId = params.get("div") ?? undefined;

        pages.forEach((p: DocumentPage) => {
            const newPage : DocumentPage = { ...p, id: p.id == "" ? crypto.randomUUID() : p.id };
            set(documentIdState, prev => ({...prev, [newPage.id]: { parentId: newPage.parentId } }));
            set(documentsState(newPage.id), newPage);
        });

        console.log(docId);

        set(documentSelectDivision, prev => divId);
        set(documentSelection, prev => docId);
    }

    const setSelectionDivison = useRecoilCallback(({ set }) => (id: string | undefined) => {
        set(documentSelectDivision, prev => id);
    });

    const setSelectionDocumentPage = useRecoilCallback(({ set }) => (id: string) => {

        // if (location.protocol == "file") {
        //     history.pushState('', "", `${location.origin}${location.pathname}/?doc=${id}`);
        // }
        // else {
        //     history.pushState('', "", `${location.origin}/?doc=${id}`);
        // }

        set(documentSelection, prev => id);
    });

    const setDocumentPage = useRecoilCallback(({ set }) => (page: DocumentPage) => {
        set(documentsState(page.id), page);
    });

    const newDocumentPage = useRecoilCallback(({ set }) => ( doc: DocumentPage) => 
    {        
        const newPage : DocumentPage = { ...doc, id: doc.id == "" ? crypto.randomUUID() : doc.id };
        set(documentIdState, prev => ([...prev, newPage.id]));
        set(documentsState(newPage.id), newPage);
        return newPage;
    })

    const setEditableMode = useRecoilCallback(({ set }) => (state: boolean) => {
        set(documentEditableMode, state);
    });

    return {
        convertToJSON,
        initializeState,
        newDocumentPage,
        setSelectionDivison,
        setSelectionDocumentPage,
        setDocumentPage,
        setEditableMode,
    }
}
