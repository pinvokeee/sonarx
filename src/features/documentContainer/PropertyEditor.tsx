import styled from "@emotion/styled";
import { Button, Chip, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Toolbar } from "@mui/material";
import { useState } from "react";
import { DocumentPage, DocumentStyle, IReturnState } from "../../common/types";

const Conatiner = styled("div")(({theme}) => ({
    
    borderLeft: "1px solid #e0e0e0 ",
    padding: "6px",

}));

const PropertyLabel = styled("div")(({theme}) => ({

    verticalAlign: "middle",

}));

export function PropertyEditor(props: { page: DocumentPage, onSave?: (page: DocumentPage) => Promise<void> }) {

    const [editPage, setEditPage] = useState<DocumentPage>({ ...props.page });

    const handleTitleEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditPage(epage => ({ ...epage, title: event.target.value }));
    }

    const handleChangeContentType = (event: SelectChangeEvent) => {
        setEditPage(epage => ({ ...epage, contentType: event.target.value as DocumentStyle}));
    }

    const handleSaveButtonClick = () => {
        props.onSave?.call(undefined, editPage);
    }

    return <>
        <Conatiner>
            <Stack paddingLeft={2} paddingRight={2} paddingTop={1} direction="column" spacing={2}>
                <TextField value={editPage.title} onInput={handleTitleEdit} size="small" label="タイトル" fullWidth multiline variant="outlined" />                                    

                <FormControl fullWidth>
                <InputLabel>ドキュメントタイプ</InputLabel>
                    <Select label="ドキュメントタイプ" value={editPage.contentType} onChange={handleChangeContentType} >
                    <MenuItem value={"text"}>テキスト</MenuItem>
                    <MenuItem value={"lexHtml"}>書式付きテキスト</MenuItem>
                    <MenuItem value={"flow"}>フローチャート</MenuItem>
                    <MenuItem value={"html"}>HTML形式</MenuItem>
                </Select>
                </FormControl>
                <div>
                    { editPage.contentType === "html" ? <Chip label="セキュリティに注意しながら編集してください" color="error"/> : <> </> }
                </div>

            </Stack>
            <Button onClick={handleSaveButtonClick}>Save</Button>
        </Conatiner>
    </>
    
}