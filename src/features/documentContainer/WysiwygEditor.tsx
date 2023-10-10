import { LexicalEditor, EditorState } from "lexical";
import { LexicalEditorComponent } from "../../components/lexicalEditor/Editor";
import { IUseEdit } from "./hook/useEditHook";

export default function WysiwygEditor( props: {
        contentText: string, 
        onChangeWysiwyg: (editor: LexicalEditor, editorState: EditorState) => void 
    })
{
    const { contentText, onChangeWysiwyg } = props;

    return <>
        <LexicalEditorComponent value={contentText} onChange={onChangeWysiwyg}></LexicalEditorComponent>
    </>
}