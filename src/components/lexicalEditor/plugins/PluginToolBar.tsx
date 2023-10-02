import { Button, Divider, IconButton, ToggleButton, ToggleButtonGroup, Toolbar, styled } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SELECTION_CHANGE_COMMAND, COMMAND_PRIORITY_CRITICAL, $getSelection, RangeSelection, FORMAT_TEXT_COMMAND, TextFormatType, LexicalEditor, $getRoot, TextNode } from 'lexical';
import { Code, FormatStrikethrough, FormatUnderlinedSharp } from '@mui/icons-material';
import { $setBlocksType, $getSelectionStyleValueForProperty } from '@lexical/selection';
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, $isQuoteNode, HeadingTagType } from '@lexical/rich-text';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import ColorPickerModal from './ColorPickerModal';

const ToolBarButton = styled(Button)(({ theme }) => ({

    '&.MuiButton-root': {
        "minWidth": "0px",
    }

}));

type EditToolbarProps = {
    // onClick: (value: string) => void,
}

const FormatTypes = {

    bold: "bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "strikethrough",
    underlinestrikethrough: "underlinestrikethrough",
    code: "code",
}

//書式変更ボタン用
//古い配列と新しい配列を比較して、増減した項目の1つめを取得し、増減の状態とあわせて返す
const getCommand = (oldFormats: string[], newFormats: string[]) => {

    const olds = oldFormats.filter(f => !newFormats.includes(f));
    const news = newFormats.filter(f => !oldFormats.includes(f));

    if (olds.length == news.length) return undefined;
    if (olds.length > 0 && news.length == 0) return { name: olds[0], toggle: false };
    if (news.length > 0 && olds.length == 0) return { name: news[0], toggle: true };
}

export function PluginToolBar(props: EditToolbarProps) {

    const [editor] = useLexicalComposerContext();
    const [activeEditor, setActiveEditor] = useState(editor);

    // const [formatState, setFormatState] = useState(Object.fromEntries(Object.keys(FormatTypes).map(name => [name, false])));    

    // const [isBold, setIsBold] = useState(false);
    // const [isItalic, setIsItalic] = useState(false);
    // const [isUnderline, setIsUnderline] = useState(false);

    const [color, setColor] = useState("");
    const [formats, setFormats] = useState((): string[] => []);

    const [showModal, setModal] = useState(false);

    const handleCloseModal = () => {
        setModal(false);
    }


    const color_input = useRef<HTMLInputElement>(null);

    const $updateToolbar = () => {

        const selection = $getSelection() as RangeSelection;
        const a = Object.keys(FormatTypes).map(key => key).filter(key => selection.hasFormat(key as TextFormatType))

        setColor(
            $getSelectionStyleValueForProperty(selection, 'color', '#000')
        )
        
        setFormats(a);
    }

    const handleFormat = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {

        const command = getCommand(formats, newFormats);
        if (command == undefined) return;

        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, command.name as TextFormatType);

        setFormats(newFormats);
    }

    const handleColor = (event: React.MouseEvent<HTMLElement>) => {
        // color_input.current?.click();
        setModal(true);
        console.log(showModal);
    }

    const log = () => {

        editor.update(() => {

            const selection = $getSelection() as RangeSelection;
            const htmlString = $generateHtmlFromNodes(editor, selection);

            console.log(htmlString);
        })
    }

    useEffect(() => {
        return editor.registerCommand(SELECTION_CHANGE_COMMAND, (_payload, newEditor) => {

            $updateToolbar();
            setActiveEditor(newEditor);

            return false;
        },
            COMMAND_PRIORITY_CRITICAL,
        );
    }, [editor, $updateToolbar]);

    useEffect(() => {
        return editor.registerCommand(FORMAT_TEXT_COMMAND, (_payload, newEditor) => {

            $updateToolbar();
            setActiveEditor(newEditor);

            return false;
        },
            COMMAND_PRIORITY_CRITICAL,
        );
    }, [editor, $updateToolbar]);

    const aaa = `<h1 dir="ltr"><span style="white-space: pre-wrap;">ewaddddddddddddddddd</span></h1><p dir="ltr"><u><s><code spellcheck="false" style="white-space: pre-wrap;"><span class="editor-underlinestrikethrough editor-code">dwa</span></code></s></u><span style="white-space: pre-wrap;">twa</span><i><b><strong class="editor-bold editor-italic" style="white-space: pre-wrap;">tatawta</strong></b></i><span style="white-space: pre-wrap;">wtaw</span></p>`;

    const onH = () => {

        activeEditor.update(() => {


            const parser = new DOMParser();
            const textHtmlMimeType: DOMParserSupportedType = 'text/html';
            const dom = parser.parseFromString(aaa, textHtmlMimeType);

            const nodes = $generateNodesFromDOM(activeEditor, dom);

            const root = $getRoot();
            root.clear();

            try {
                root.append(...nodes);
            }
            catch
            {
                root.append(new TextNode("dadw"));
            }

            // const selection = $getSelection() as RangeSelection;
            // const aa = selection.getNodes();

            // $setBlocksType(selection, () => $createHeadingNode("h1"))

            // console.log(aa);
        });

    }

    return <>
        <Toolbar disableGutters={true}>
            <div style={{ display: "flex", gap: "6px" }}>
                <div>
                    <Button onClick={onH}>H1</Button>
                    <Button onClick={log}>LG</Button>
                </div>
                <div>
                    <ToolBarButton onClick={handleColor} value="color" sx={{ color }}>
                        <ColorPickerModal isShow={showModal} onClose={handleCloseModal}></ColorPickerModal>
                        {/* <input type="color" value={color} ref={color_input} style={{display: "none"}}></input> */}
                        <FormatColorTextIcon></FormatColorTextIcon>
                    </ToolBarButton>
                </div>
                <div>

                    <ToggleButtonGroup value={formats} onChange={handleFormat} size="small">

                        <ToggleButton value={FormatTypes.bold}>
                            <FormatBoldIcon></FormatBoldIcon>
                        </ToggleButton>

                        <ToggleButton value={FormatTypes.italic}>
                            <FormatItalicIcon></FormatItalicIcon>
                        </ToggleButton>

                        <ToggleButton value={FormatTypes.underline} >
                            <FormatUnderlinedIcon></FormatUnderlinedIcon>
                        </ToggleButton>

                        <ToggleButton value={FormatTypes.strikethrough} >
                            <FormatStrikethrough></FormatStrikethrough>
                        </ToggleButton>

                        <ToggleButton value={FormatTypes.code} >
                            <Code></Code>
                        </ToggleButton>

                    </ToggleButtonGroup>
                </div>
            </div>
        </Toolbar>
    </>
}

