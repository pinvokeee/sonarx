import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {$setSelection, $createRangeSelection, $createNodeSelection} from 'lexical';
import { useState, useEffect, useLayoutEffect } from "react";

export const ChangeReadOnlyPlugin = (props : { readonly: boolean | undefined }) => {

    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        editor.update(() => {
            editor.setEditable(props.readonly ?? false);
        });
    }, [editor, props.readonly]);
    
    useEffect(() => {
        editor.registerEditableListener((isEditable) => {
                console.log("TESTB");
                editor.focus();
                const rangeSelection = $createRangeSelection();
                $setSelection(rangeSelection);
        });
    }, []);

    return <></>
}