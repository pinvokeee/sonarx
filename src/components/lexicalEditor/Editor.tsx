import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { styled } from '@mui/material';
import { $applyNodeReplacement, $getRoot, $getSelection, $insertNodes, DecoratorNode, EditorState, ElementNode, LexicalEditor, ParagraphNode, RootNode, TextNode } from 'lexical';
import { $generateNodesFromDOM } from '@lexical/html';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import "./Editor.css";
import { PluginToolBar } from './plugins/PluginToolBar';
import { ImageNode, ImagePlugin } from './plugins/nodes/ImageNode';
import { NoteNode, NotePlugin } from './plugins/nodes/NoteNode';
import { AutoScroll } from './plugins/AutoScroll';
import { ReactFlowNode, ReactFlowPlugin } from './plugins/nodes/ReactFlowNode';
import { ChangeReadOnlyPlugin } from './plugins/ApplyReadOnly';
import LexicalClickableLinkPlugin from '@lexical/react/LexicalClickableLinkPlugin';
import { LexicalAutoLinkPlugin } from './plugins/AutoLinkPlugin';
import { AutoFocus } from './plugins/AutoFocus';

const theme = {
    paragraph: 'editor-paragraph',
    text: {
        bold: 'editor-bold',
        code: 'editor-code',
        italic: 'editor-italic',
        strikethrough: 'editor-strikethrough',
        subscript: 'PlaygroundEditorTheme__textSubscript',
        superscript: 'PlaygroundEditorTheme__textSuperscript',
        underline: 'editor-underline',
        underlineStrikethrough: 'editor-underlinestrikethrough',
    },
}

const ContentEditor = styled(ContentEditable)(({ theme }) => (
    {
        outline: "none",
        // height: "100%",
        padding: "10px",
        boxSizing: "border-box",
    }
));

const Scroller = styled("div")(({ theme }) => (
    {
        overflow: "auto"
    }
));

function MyCustomAutoFocusPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        // Focus the editor when the effect fires!
        // console.log(editor.);
        editor.focus();
        const selection = document.getSelection();

        if (selection && selection.focusNode) {
            const range = selection.getRangeAt(0);
            range?.setStart(selection.focusNode, 0);
        }

        console.log(selection); 
        
    }, [editor]);

    return null;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: any) {
    console.error(error);
}

const initialConfig = {
    namespace: 'MyEditor',
    theme,
    nodes: [
        TextNode,
        ParagraphNode,
        ListNode,
        ListItemNode,
        LinkNode,
        AutoLinkNode,
        HeadingNode,
        QuoteNode,
        ImageNode,
        NoteNode,
        ReactFlowNode,
    ],
    onError,
};

const getComponent = (config : any, onChange?: (editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => void ) => {
        return (<LexicalComposer initialConfig={config} >
        <div style={{ display: "grid", gridTemplateRows: "auto 1fr", overflow: "hidden" }}>
            {/* <ChangeReadOnlyPlugin readonly={props.editable} /> */}
            <AutoScroll />
            <LexicalAutoLinkPlugin />
            { !config.editable && <LexicalClickableLinkPlugin />}
            { config.editable && <PluginToolBar /> }
            <ImagePlugin />
            <NotePlugin />
            <ReactFlowPlugin />
            <AutoFocus />
            <Scroller>
                <div className='editor'>
                    <RichTextPlugin
                        contentEditable={<ContentEditor spellCheck={false} />}
                        placeholder={<></>}
                        // placeholder={<div className='editor-placeholder'>Enter some text...</div>}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    { onChange && <OnChangePlugin onChange={onChange} /> }
                    {/* <EditUpdate src={props.value} /> */}
                    <HistoryPlugin />
                </div>
            </Scroller>
        </div>
        </LexicalComposer>);
}

export const LexicalEditorComponent = (props: { value: string, onChange?: (editor: LexicalEditor, editorState: EditorState) => void }) => {

    const config = { ...initialConfig,     
        editable: true,
        editorState: props.value,
    }

    const onChange = (editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => {
        editorState.read(() => {            
            props.onChange?.call(undefined, editor, editorState);
        });
    }

    return getComponent(config, onChange);
};

export const LexicalViewerComponent = (props: { value: string } ) => {
    
    const config = { ...initialConfig,     
        editable: false,
        editorState: props.value,
    }

    return getComponent(config);
}

export default { LexicalEditorComponent, LexicalViewerComponent }