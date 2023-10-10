import { Button, Drawer, List, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import React from "react";
import { useDocumentSetterActions, useDocuments } from "../../common/states/document";

const AllDivisionText = "すべてのディビジョン";

export default function DivisionSelector() {

    const document = useDocuments();
    const divisionId = document.selectedDivisionId;

    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);

    const page = document.useGetFromId(divisionId as string);
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

    const { setSelectionDivison } = useDocumentSetterActions();
    
    const document = useDocuments();
    const pages = document.pages;

    const divisionId = document.selectedDivisionId;

    const divs = Object.keys(document.idList).filter(id => pages[id].parentId == undefined);

    const handleSelect = (id: string | undefined) => {
        setSelectionDivison(id);
        props.onClose();
    }

    return <>
        <Drawer anchor="left" open={props.open} onClose={props.onClose}>
            <List>
                <MenuItem onClick={() => handleSelect(undefined)} selected={divisionId == undefined}>{AllDivisionText}</MenuItem>
                {divs.map(id => <DivisionDrawerItem key={id} id={id} selected={divisionId == id} handleSelect={handleSelect}></DivisionDrawerItem>)}
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

    const document = useDocuments();
    const page = document.useGetFromId(props.id);
    const handleClick = () => props.handleSelect(props.id);

    return <MenuItem onClick={handleClick} value={props.id} selected={props.selected}>{page?.title}</MenuItem>;
}
