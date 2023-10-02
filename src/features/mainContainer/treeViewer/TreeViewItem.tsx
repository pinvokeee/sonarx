import { TreeItem } from "@mui/x-tree-view";
import { DocumentPage, IdDictionary } from "../../../common/types";
import { useCallback } from "react";
import { styled } from "@mui/material";
import { useDocuments } from "../../../common/states/document";

const CustomTreeItem = styled(TreeItem)(({ theme }) => (
    {
        '& .MuiTreeItem-label': {
            padding: "10px 0 10px 0",
        }
    }
));

type TreeViewItemProp = {
    documentPageId: string
    parentId?: string,
}

const getChildren = (idList: string[], parentId: string, pages: { [key: string]: DocumentPage }) => {
    return Object.keys(idList).filter(id => pages[id].parentId == parentId);
};

export default function TreeViewItem(props: TreeViewItemProp) {

    const documents = useDocuments();
    const pages = documents.pages;

    const page = documents.useGetFromId(props.documentPageId);
    const children = getChildren(documents.idList, props.documentPageId, pages);

    if (page.parentId != props.parentId) return <></>;

    return <>
        <CustomTreeItem nodeId={props.documentPageId} key={props.documentPageId} label={page.title} >
            {children.map(child => <TreeViewItem key={child} documentPageId={child} parentId={props.documentPageId}></TreeViewItem>)}
        </CustomTreeItem>
    </>
}