import { AppBar, Box, Button, InputAdornment, OutlinedInput, Toolbar } from "@mui/material"
import { Search } from '@mui/icons-material';
import DivisionSelecotr from "./DivisionSelector";
import { useDocumentSetterActions, useDocuments } from "../../common/states/document";

function SearchTextField() {

    return <OutlinedInput sx={{ width: "70%" }} color="info" id="input-with-icon-adornment"
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
                <Toolbar sx={{ justifyContent: 'space-between' }}>

                    <DivisionSelecotr></DivisionSelecotr>
                    <SearchTextField />

                    {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography> */}
                    <Button onClick={handleChangeEditMode} color="inherit">{changeEditableModeButtonText}</Button>
                    <Button onClick={downloadData}>ダウンロード</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}