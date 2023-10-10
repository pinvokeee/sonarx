import { AppBar, Box, Button, Divider, IconButton, InputAdornment, MenuItem, OutlinedInput, Toolbar, styled } from "@mui/material"
import { Search, Menu, Label } from '@mui/icons-material';
import DivisionSelector from "./DivisionSelector";
import { useDocumentSetterActions, useDocuments } from "../../common/states/document";
import { OtherMenuButton } from "./OtherMenuButton";
import { grey } from "@mui/material/colors";

const F = styled("div")(({theme}) => (
    {
        color: "white",
        gap: "2",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    }
));

function SearchTextField() {

    return <OutlinedInput sx={{ width: "70%", flexGrow: "2" }} color="info" id="input-with-icon-adornment"
        startAdornment={
            <InputAdornment position="start">
                <Search />
            </InputAdornment>
        } />
}

export default function Header() {

    const { isEditableMode } = useDocuments();
    const { setEditableMode, convertToJSON } = useDocumentSetterActions();

    const click = () => {
        // a();
    }

    const changeEditableModeButtonText = !isEditableMode ? "編集モードへ切り替え" : "編集モードを解除する";

    const handleChangeEditMode = () => {
        setEditableMode(!isEditableMode);
    }

    const downloadData = () => {

        const json = convertToJSON();
        const js = `const sheet = ${json};`;

        const blob = new Blob([js], { type: 'text/plain' });
        const a = document.createElement('a');
        const objUrl = URL.createObjectURL(blob);
        a.href = objUrl;
        a.target = '_blank';
        a.download = "sheet.js";
        a.click();
        a.remove();
        URL.revokeObjectURL(objUrl);
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar elevation={0} position="static">
                <Toolbar >
                    <F>
                        <DivisionSelector></DivisionSelector>
                        <SearchTextField />
                        <OtherMenuButton buttonNode={<IconButton ><Menu/></IconButton>} onMenuClick={click}>
                            <Divider></Divider>
                            {/* <Label>AAA</Label> */}
                            <MenuItem>{changeEditableModeButtonText}</MenuItem>
                            <MenuItem>ダウンロード</MenuItem>
                        </OtherMenuButton>

                    </F>

                </Toolbar>
            </AppBar>
        </Box>
    );
}