import { LexicalEditor, EditorState } from "lexical";
import { LexicalEditorComponent, LexicalViewerComponent } from "../../components/lexicalEditor/Editor";
import { IUseEdit } from "./hook/useEditHook";

export default function WysiwygEditor( props: {
        contentText: string, 
        onChangeWysiwyg: (editor: LexicalEditor, editorState: EditorState) => void,
        isEditable? : boolean,
    })
{
    const { contentText, onChangeWysiwyg, isEditable } = props;

    return <>
        {  isEditable && <LexicalEditorComponent value={contentText} onChange={onChangeWysiwyg} /> }
        { !isEditable && <LexicalViewerComponent value={contentText} /> }
    </>
}