import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {$setSelection, $createRangeSelection, $createNodeSelection, $getSelection, SELECTION_CHANGE_COMMAND, COMMAND_PRIORITY_CRITICAL, $getRoot, $getNodeByKey} from 'lexical';
import { useEffect } from 'react';

export const AutoFocus = () => {

    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        editor.update(() => {
            const a = $getRoot().getFirstChild();
            a?.selectStart();
        });
    }, [editor]);

    return <></>
}
