import { VFC, useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { styled } from '@mui/material';
import "./styles.css";
import { IUseEdit } from '../../features/documentContainer/hook/useEditHook';

const Container = styled("div")(({ theme }) => (
    {
        width: "100%",
        height: "100%",
        // overflow: "hidden",
    }
));

const Editor = styled("div")(({ theme }) => (
    {
        // flex: "auto",
        // position: "relative",
        overflow: "hidden",
        height: "100%",
        width: "100%",
    }
));

type MonacoEditorProps = { value: string, onChange: (value: string) => void, }

export default function MonacoEditor(props: MonacoEditorProps) {

    const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
    const monacoEl = useRef(null);

    const [prevText, setPrevText] = useState("");

    const handleInput = (value: string) => {        
        setPrevText(value);
        props.onChange(value);
    };

    useLayoutEffect(() => {
        console.log(editor, prevText, props.value)
        if (prevText !== props.value) {
            editor?.setValue(props.value ?? "予期せぬエラー")            
            setPrevText(props.value);
        }
     }, [editor, prevText, props.value]);

    useLayoutEffect(() => {

        if (monacoEl) {

            setEditor((editor) => {

                if (editor) return editor;

                const newEditor = monaco.editor.create(monacoEl.current!, {
                    value: props.value,
                    language: 'html',
                    automaticLayout: true,
                    scrollbar: {
                        vertical: "auto",
                    }
                });

                // handleInit(props.value ?? '');

                newEditor?.onDidChangeModelContent((e: monaco.editor.IModelContentChangedEvent) => {
                    handleInput(newEditor!.getValue() ?? '');
                });

                return newEditor;
            });

        }

        return () => editor?.dispose();

    }, []);

    return <Container>
        <Editor ref={monacoEl}></Editor>
    </Container>
};