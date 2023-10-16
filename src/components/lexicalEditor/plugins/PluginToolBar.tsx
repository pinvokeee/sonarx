import { Button, Divider, IconButton, MenuItem, Select, SelectChangeEvent, ToggleButton, ToggleButtonGroup, Toolbar, styled } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import ImageIcon from '@mui/icons-material/Image';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { $createParagraphNode, $isRootOrShadowRoot, DEPRECATED_$isGridSelection, $isRangeSelection, KEY_ENTER_COMMAND, SELECTION_CHANGE_COMMAND, COMMAND_PRIORITY_CRITICAL, $getSelection, RangeSelection, FORMAT_TEXT_COMMAND, TextFormatType, LexicalEditor, $getRoot, TextNode, $insertNodes } from 'lexical';
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
import { ToolBarButton } from './buttons/ToolBarButton';
import { $createImageNode, INSERT_IMAGE_COMMAND } from './nodes/ImageNode';
import { $createNoteNode, INSERT_NOTE_COMMAND } from './nodes/NoteNode';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { INSERT_REACTFLOW_COMMAND } from './nodes/ReactFlowNode';

type EditToolbarProps = {
    // onClick: (value: string) => void,
}

type TextStyle = {
    textColor: string,
    backColor: string,
    headerType: HeadType,
    decorations: string[],
}

const FormatTypes = {

    bold: "bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "strikethrough",
    underlinestrikethrough: "underlinestrikethrough",
    code: "code",
}

type HeadType = "normal" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const headerTypes : { text: string, tag: HeadType }[] = [
    { text: "見出しなし", tag: "normal"},
    { text: "見出し1", tag: "h1"},
    { text: "見出し2", tag: "h2"},
    { text: "見出し3", tag: "h3"},
    { text: "見出し4", tag: "h4"},
    { text: "見出し5", tag: "h5"},
    { text: "見出し6", tag: "h6"},
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
    const [enter, setEnter] = useState(false);

    // const [formatState, setFormatState] = useState(Object.fromEntries(Object.keys(FormatTypes).map(name => [name, false])));    

    // const [isBold, setIsBold] = useState(false);
    // const [isItalic, setIsItalic] = useState(false);
    // const [isUnderline, setIsUnderline] = useState(false);

    // const [style, setStyle] = useState();

    // const [color, setColor] = useState("");
    // const [head, setHead] = useState("");
    
    const [textStyle, setTextStyle] = useState<TextStyle>({
        backColor: "",
        textColor: "",
        headerType: "normal",
        decorations: [],
    });
    

    const color_input = useRef<HTMLInputElement>(null);

    const $updateToolbar = () => {

        const selection = $getSelection() as RangeSelection;

        let headerType : HeadType = "normal";

        if ($isRangeSelection(selection)) {

            const anchorNode = selection.anchor.getNode();
            let element = anchorNode.getKey() === 'root'
            ? anchorNode
            : $findMatchingParent(anchorNode, (e) => {
                const parent = e.getParent();
                return parent !== null && $isRootOrShadowRoot(parent);
            });
      
            if (element === null) element = anchorNode.getTopLevelElementOrThrow();
            if ($isHeadingNode(element)) headerType = element.getTag() as HeadType;
        }

        if ($isRangeSelection(selection)) {
            const textColor = $getSelectionStyleValueForProperty(selection, 'color') ?? "#FFFFFF";
            const backColor = $getSelectionStyleValueForProperty(selection, 'background-color') ?? "#FFFFFF";
            const decorations = Object.keys(FormatTypes).map(key => key).filter(key => selection.hasFormat(key as TextFormatType))
            
            setTextStyle(style => ({ ...style, headerType, textColor, backColor, decorations }));
        }
    }


    const applyStyleText = useCallback((styles: Record<string, string>) => {
        activeEditor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection)) {
                    $patchStyleText(selection, styles);
                }
            }
        )},
        [activeEditor]
    );

    useEffect(() => {

        if (!enter) return ;



    }, [enter]);

    useEffect(() => {
        return editor.registerCommand(SELECTION_CHANGE_COMMAND, (_payload, newEditor) => {

            $updateToolbar();
            setActiveEditor(newEditor);
            

            return false;
        },
            COMMAND_PRIORITY_CRITICAL,
        );
    }, [editor, $updateToolbar, enter]);

    useEffect(() => {
        return editor.registerCommand(FORMAT_TEXT_COMMAND, (_payload, newEditor) => {

            $updateToolbar();
            setActiveEditor(newEditor);

            return false;
        },
            COMMAND_PRIORITY_CRITICAL,
        );
    }, [editor, $updateToolbar]);

    const handleHeadChange = (event: SelectChangeEvent) => {

        activeEditor.update(() => {
            const selection = $getSelection();
                        
            if (event.target.value != "") {
                if ($isRangeSelection(selection)) $setBlocksType(selection, () => $createHeadingNode(event.target.value as HeadingTagType));     
            }
            else {
                if ($isRangeSelection(selection)) $setBlocksType(selection, () => $createParagraphNode());
            }

            const headerType = event.target.value as HeadType;
            setTextStyle(style => ({ ...style, headerType }));
        });
    }

    const handleSelectImage = () => {

        // activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, 
        //     {
        //         alt: "te",
        //         imageTypeSoruce: "link", 
        //         src: "https://img.pokemon-matome.net/poke/231001/F71Z4nwboAAmSVS.jpg",
        //     }
        // );
    }

    const handleInsertNode = () => {

        // activeEditor.dispatchCommand(INSERT_NOTE_COMMAND, 
        //     {
        //         text: "TESt",
        //         type: "success",
        //     }
        // );

        activeEditor.dispatchCommand(INSERT_REACTFLOW_COMMAND, 
            {
            }
        );
    }

    const handleSelectionImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        
        const file = event.target.files?.item(0);

        if (file) {                
            activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, 
                {
                    alt: "te",
                    imageTypeSoruce: "base64", 
                    src: await imageBinToBase64(file),
                }
            );
        }
    }

    const imageBinToBase64 = (file: File) : Promise<string> => {
        return new Promise((resolve, reject) => {
            const fr = new FileReader();
            console.log(file);
            fr.onloadend = () => resolve((fr.result as string) ?? "")
            fr.readAsDataURL(file);
        });
    }

    // const InsertImageButton = () => {

    //     const [editor] = useLexicalComposerContext();
        
    //     return (
    //         <label className='...' aria-label='image upload'>
    //             <ImageIcon className='...' />
    //             <span className='...'>画像を挿入</span>
    //             <input id="file-upload" type='file' className='hidden' onChange={async (e) => {
    //                 const file = e.target.files[0];
    //                 const { path } = await uploadImage(file);//画像をアップロード
    //                 editor.update(() => {
    //                     editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
    //                         altText: file.name,
    //                         src: path
    //                     });
    //                 });
    //             }} />
    //         </label>
    //     );
    // };
    


    const getHeaderType = () => textStyle.headerType;
    const getTextColor = () => textStyle.textColor;
    const getBackColor = () => textStyle.backColor;
    const isCheckedStyle = (style: string) => textStyle.decorations.includes(style);
    const isCheckedBold = () => isCheckedStyle(FormatTypes.bold);
    const isCheckedItalic = () => isCheckedStyle(FormatTypes.italic);
    const isCheckedUnderline = () => isCheckedStyle(FormatTypes.underline);
    const isCheckedStrikethrough = () => isCheckedStyle(FormatTypes.strikethrough);
    const isCheckedCode = () => isCheckedStyle(FormatTypes.code);
    
    const handleColorChange = (color: string) => {
        applyStyleText({ color } );
        setTextStyle(style => ({...style, color}));
    }

    const handleBackColorChange = (backColor: string) => {
        applyStyleText({ "background-color": backColor } );
        setTextStyle(style => ({...style, backColor}));
    }

    const handleTextDecorationChange = (event: React.MouseEvent<HTMLElement>, value: string) => {

        const format = value;
        const del = textStyle.decorations.includes(value);
        const decorations = [...textStyle.decorations, format].filter(val => ((!del) && val == format) || (val != format));

        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, format as TextFormatType);

        setTextStyle(style => ({ ...style, decorations }));
    }

    const cancelClick = (event: React.MouseEvent<HTMLDivElement>) => {        
        event.preventDefault();
        event.cancelable = true;
        event.stopPropagation();
    }

    return <>
        <Toolbar onMouseDown={cancelClick} sx={{ gap: "10px" }}>

            <div>
                <Select  size="small" value={getHeaderType()} onChange={handleHeadChange}>
                    {
                        headerTypes.map(head => <MenuItem value={head.tag}>{head.text}</MenuItem>)
                    }
                </Select>
            </div>

            <Divider flexItem orientation='vertical' variant='fullWidth' ></Divider>

            <div>
                <ToolBarButtonColorPicker color={getTextColor()} onChangeColor={handleColorChange}>
                    <FormatColorTextIcon></FormatColorTextIcon>
                </ToolBarButtonColorPicker>      

                <ToolBarButtonColorPicker color={getBackColor()} onChangeColor={handleBackColorChange}>
                    <FormatColorFillIcon></FormatColorFillIcon>
                </ToolBarButtonColorPicker>                          
                
                <StyledToggleButton size='small' onChange={handleTextDecorationChange} value={FormatTypes.bold} selected={isCheckedBold()}>
                    <FormatBoldIcon></FormatBoldIcon>
                </StyledToggleButton>

                <StyledToggleButton size='small' onChange={handleTextDecorationChange} value={FormatTypes.italic} selected={isCheckedItalic()}>
                        <FormatItalicIcon></FormatItalicIcon>
                </StyledToggleButton>

                <StyledToggleButton size='small' onChange={handleTextDecorationChange} value={FormatTypes.underline} selected={isCheckedUnderline()}>
                    <FormatUnderlinedIcon></FormatUnderlinedIcon>
                </StyledToggleButton>

                <StyledToggleButton size='small' onChange={handleTextDecorationChange} value={FormatTypes.strikethrough} selected={isCheckedStrikethrough()}>
                    <FormatStrikethrough></FormatStrikethrough>
                </StyledToggleButton>

                <StyledToggleButton size='small' onChange={handleTextDecorationChange} value={FormatTypes.code} selected={isCheckedCode()}>
                    <Code></Code>
                </StyledToggleButton>
            </div>

            <Divider flexItem orientation='vertical' variant='fullWidth' ></Divider>

            <div>
            <ToolBarButton onClick={handleInsertNode} value='image'>
                    <ImageIcon></ImageIcon>
                </ToolBarButton>

                <ToolBarButton onClick={handleSelectImage} value='image'>
                    <ImageIcon></ImageIcon>
                    <input type='file' className='hidden' onChange={handleSelectionImage}></input>
                </ToolBarButton>
            </div>


        </Toolbar>

    </>
}

const StyledToggleButton = styled(ToggleButton)(({theme}) => (
    {
        '&.MuiToggleButton-root': {
            verticalAlign: "top",
            border: "none",
            // "minWidth": "0px",
            // "padding": "0",
        },
    }
));