import { Button, Drawer, List, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useDocumentAction, useGetDocumentPageAction } from "../documentContainer/documentState";
import { useState } from "react";
import React from "react";

const AllDivisionText = "すべてのディビジョン";

export default function DivisionSelecotr() {

    const { useGetDocumentPage, selectedDivisionId } = useGetDocumentPageAction();
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);

    const page = useGetDocumentPage(selectedDivisionId as string);
    const text = page ? page.title : AllDivisionText;

    return <React.Fragment>
        <Button onClick={() => setIsOpen(true)} color="inherit">{text}</Button>
        <DivisionDrawer open={isOpen} onClose={handleClose}></DivisionDrawer>
    </React.Fragment>
}

type DivisionDrawerProps = {
    open: boolean
    onClose: () => void,
}

export function DivisionDrawer(props: DivisionDrawerProps) {

    const { setSelectionDivison } = useDocumentAction();
    const { documentIds, selectedDivisionId } = useGetDocumentPageAction();

    const divs = Object.keys(documentIds).filter(id => documentIds[id].parentId == undefined);

    const handleSelect = (id: string | undefined) => {
        setSelectionDivison(id);
        props.onClose();
    }

    return <>
        <Drawer anchor="left" open={props.open} onClose={props.onClose}>
            <List>
                <MenuItem onClick={() => handleSelect(undefined)} selected={selectedDivisionId == undefined}>{AllDivisionText}</MenuItem>
                {divs.map(id => <DivisionDrawerItem id={id} selected={selectedDivisionId == id} handleSelect={handleSelect}></DivisionDrawerItem>)}
            </List>
        </Drawer>
    </>
}

type DivisionDrawerItemProps = {
    id: string,
    selected: boolean,
    handleSelect: (id: string) => void,
}

export function DivisionDrawerItem(props: DivisionDrawerItemProps) {

    const { useGetDocumentPage } = useGetDocumentPageAction();
    const page = useGetDocumentPage(props.id);
    const handleClick = () => props.handleSelect(props.id);

    return <MenuItem onClick={handleClick} value={props.id} selected={props.selected}>{page?.title}</MenuItem>;
}
