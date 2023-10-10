import { Button, Menu, MenuItem } from "@mui/material"
import { useState } from "react";

export const OtherMenuButton = (props: { buttonNode?: React.ReactNode, onMenuClick?: (value: string) => void, children?: React.ReactNode }) => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleClickMenu = () => {
        handleClose();
    }

    return <div>
        <div onClick={handleClick}>{props.buttonNode}</div>
        <Menu anchorEl={anchorEl} onClick={handleClickMenu} open={open} onClose={handleClose} MenuListProps={{
            'aria-labelledby': 'basic-button',
        }}
        >{props.children}</Menu>
    </div>
}