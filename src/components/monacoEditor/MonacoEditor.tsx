import { VFC, useRef, useState, useEffect, useCallback } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { styled } from '@mui/material';

const Container = styled("div")(({theme}) => (
	{
		width: "100%",
		height: "100%",
		// overflow: "hidden",
	}
));

const Editor = styled("div")(({theme}) => (
{
    // flex: "auto",
    // position: "relative",

    height: "100%",
	width: "100%",
}));

type MonacoEditorProps = {
	value: string,
	handleContentChange?: (newValue: string) => void,
}

export default function MonacoEditor(props: MonacoEditorProps) {

	const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);

	const monacoEl = useRef(null);

	const handleInput = useCallback((value: string) => {
		props.handleContentChange?.call(undefined, value);
	}, []);

	useEffect(() => {

		if (monacoEl) {

			setEditor((editor) => {

				if (editor) return editor;
				
				const newEditor = monaco.editor.create(monacoEl.current!, {
					value: "",
					language: 'html',
					automaticLayout: true,
					scrollbar: {
						vertical: "auto",
					}
				});

				newEditor.onDidChangeModelContent(() => {
					handleInput(newEditor?.getValue() ?? '');
				});
			  
				return newEditor;
			});
			
		}

		return () => editor?.dispose();
		
	}, [monacoEl.current]);

	useEffect(() => {
		editor?.setValue(props.value);
	}, [monacoEl.current, editor, props.value]);

	return <Container>
		<Editor ref={monacoEl}></Editor>
	</Container>
};