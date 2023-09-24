import { TreeItem } from "@mui/x-tree-view";
import { useGetDocumentPageAction } from "../documentState";
import { IdDictionary } from "../../../common/types";
import { useCallback } from "react";
import { styled } from "@mui/material";

type TreeViewItemProp = {
    documentPageId: string
    parentId?: string,
}

const PTreeItem = styled(TreeItem)(({theme}) => (
{
    '& .MuiTreeItem-label': {
        padding: "10px 0 10px 0",
    }
}
));

export default function TreeViewItem(props: TreeViewItemProp) {

    const docActions = useGetDocumentPageAction();

    const getChildren = useCallback((ids: IdDictionary, parentId: string) => {
        return Object.keys(ids).filter(id => ids[id].parentId == parentId);
    }, []);

    const page = docActions.useGetDocumentPage(props.documentPageId);
    const children = getChildren(docActions.documentIds, props.documentPageId); 

    if (page.parentId != props.parentId) return <></>;

    return <>
        <PTreeItem nodeId={props.documentPageId} key={props.documentPageId} label={page.title}>
            { children.map(child => <TreeViewItem key={child} documentPageId={child} parentId={props.documentPageId}></TreeViewItem> ) }
        </PTreeItem>
    </>
}