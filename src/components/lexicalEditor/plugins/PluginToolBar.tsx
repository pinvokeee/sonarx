import { Button, Divider, IconButton, MenuItem, Select, SelectChangeEvent, ToggleButton, ToggleButtonGroup, Toolbar, styled } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { $createParagraphNode, $isRootOrShadowRoot, DEPRECATED_$isGridSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND, COMMAND_PRIORITY_CRITICAL, $getSelection, RangeSelection, FORMAT_TEXT_COMMAND, TextFormatType, LexicalEditor, $getRoot, TextNode } from 'lexical';
import { Code, FormatStrikethrough, FormatUnderlinedSharp } from '@mui/icons-material';
import { $setBlocksType, $getSelectionStyleValueForProperty, $patchStyleText } from '@lexical/selection';
import { $createHeadingNode,  $createQuoteNode, $isHeadingNode, $isQuoteNode, HeadingTagType } from '@lexical/rich-text';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import ColorPickerModal from './ColorPickerModal';
import ToolBarButtonColorPicker from './buttons/ToolBarButtonColorPicker';
import {
    $findMatchingParent,
    $getNearestBlockElementAncestorOrThrow,
    $getNearestNodeOfType,
    mergeRegister,
  } from '@lexical/utils';

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

const headerTypes = [
    { text: "通常", tag: "normal"},
    { text: "大きい6 <h1>", tag: "h1"},
    { text: "大きい5 <h2>", tag: "h2"},
    { text: "大きい4 <h3>", tag: "h3"},
    { text: "大きい3 <h4>", tag: "h4"},
    { text: "小さい1 <h5>", tag: "h5"},
    { text: "小さい2 <h6>", tag: "h6"},
];


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
    const [head, setHead] = useState("");
    const [formats, setFormats] = useState((): string[] => []);



    const color_input = useRef<HTMLInputElement>(null);

    const $updateToolbar = () => {

        const selection = $getSelection() as RangeSelection;
        const a = Object.keys(FormatTypes).map(key => key).filter(key => selection.hasFormat(key as TextFormatType))

        if ($isRangeSelection(selection)) {

            const anchorNode = selection.anchor.getNode();
            let element =
              anchorNode.getKey() === 'root'
                ? anchorNode
                : $findMatchingParent(anchorNode, (e) => {
                    const parent = e.getParent();
                    return parent !== null && $isRootOrShadowRoot(parent);
                  });
      
            if (element === null) element = anchorNode.getTopLevelElementOrThrow();
    
            const h = $isHeadingNode(element);
            
            if (h) {
                setHead(element.getTag());
            }
            else {
                console.log(h);
                setHead("normal");
            }
            

        }

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

    const handleColorChange = (color: string) => {
        setColor(color);
        applyStyleText({ color } );
    }

    const applyStyleText = useCallback(
        (styles: Record<string, string>) => {
          activeEditor.update(() => {
            const selection = $getSelection();
            if (
              $isRangeSelection(selection) ||
              DEPRECATED_$isGridSelection(selection)
            ) {
              $patchStyleText(selection, styles);
            }
          });
        },
        [activeEditor],
      );



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

    const onH = () => {

        activeEditor.update(() => {

            const selection = $getSelection();
            
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode("h1"));
            }

        });

    }

    const handleHeadChange = (event: SelectChangeEvent) => {

        activeEditor.update(() => {

            const selection = $getSelection();
                        
            if (event.target.value != "") {
                if ($isRangeSelection(selection)) {
                    $setBlocksType(selection, () => $createHeadingNode(event.target.value as HeadingTagType));
                  }      
            }
            else {
                if ($isRangeSelection(selection)) {
                    $setBlocksType(selection, () => $createParagraphNode());
                  }      
            }

            setHead(event.target.value as string);

        });
    }

    return <>
        <Toolbar disableGutters={true}>
            <div style={{ display: "flex", gap: "6px" }}>
                <div>
                    <Select fullWidth size="small" value={head} onChange={handleHeadChange}>
                        {
                            headerTypes.map(head => <MenuItem value={head.tag}>{head.text}</MenuItem>)
                        }
                    </Select>
                </div>
                <div>
                    {/* <Button onClick={onH}>H1</Button> */}
                    {/* <Button onClick={log}>LG</Button> */}
                </div>
                <div>
                    <ToolBarButtonColorPicker color={color} onChangeColor={handleColorChange}>
                        <FormatColorTextIcon></FormatColorTextIcon>
                    </ToolBarButtonColorPicker>
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

