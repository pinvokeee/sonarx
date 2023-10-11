import React, { forwardRef, useEffect, useState } from 'react';
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
import { ImageNode, ImagePlugin } from './plugins/ImageNode';
import { NoteNode, NotePlugin } from './plugins/NoteNode';

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
        editor.focus();
    }, [editor]);

    return null;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: any) {
    console.error(error);
}

export const LexicalEditorComponent = (props: { value: string, onChange?: (editor: LexicalEditor, editorState: EditorState) => void }) => {

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
        ],
        editorState: props.value,
        onError,
    };

    // const [st, setState] = useState(props.value);

    // const state = editor.parseEditorState(props.src);
    // editor.setEditorState(state);

    const onChange = (editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => {
        editorState.read(() => {            
            props.onChange?.call(undefined, editor, editorState);
        });
    }

    return (
        <>
            <LexicalComposer initialConfig={initialConfig}>
                <div style={{ display: "grid", gridTemplateRows: "auto 1fr", overflow: "hidden" }}>
                    <ImagePlugin />
                    <NotePlugin />
                    <PluginToolBar></PluginToolBar>
                    <Scroller>
                        <div className='editor'>
                            <RichTextPlugin
                                contentEditable={<ContentEditor spellCheck={false} />}
                                placeholder={<></>}
                                // placeholder={<div className='editor-placeholder'>Enter some text...</div>}
                                ErrorBoundary={LexicalErrorBoundary}
                            />
                            <OnChangePlugin onChange={onChange} />
                            {/* <EditUpdate src={props.value} /> */}
                            <HistoryPlugin />
                            <MyCustomAutoFocusPlugin />
                        </div>
                    </Scroller>
                </div>
            </LexicalComposer>
        </>
    );
};

export default {}