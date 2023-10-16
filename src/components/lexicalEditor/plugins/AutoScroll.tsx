import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { KEY_ENTER_COMMAND, COMMAND_PRIORITY_CRITICAL, KEY_BACKSPACE_COMMAND } from "lexical";
import { editor } from "monaco-editor";
import { useEffect, useState } from "react";

export const AutoScroll = () => {

    const [editor] = useLexicalComposerContext();
    const [enter, setEnter] = useState(false);

    useEffect(() => {
        return editor.registerCommand(KEY_ENTER_COMMAND, (_payload, newEditor) => {
            setEnter(true);
            return false;
        },
            COMMAND_PRIORITY_CRITICAL,
        );
    }, [editor]);

    useEffect(() => {
        return editor.registerCommand(KEY_BACKSPACE_COMMAND, (_payload, newEditor) => {
            setEnter(true);
            return false;
        },
            COMMAND_PRIORITY_CRITICAL,
        );
    }, [editor]);

    const onChange = () => {
        console.log(enter)

        if (enter) {

            const selection = document.getSelection();
            const element = selection?.focusNode;
        
            if (element) {
                
                let targetTag = element.nodeType == Node.TEXT_NODE ? element.parentElement :
                element.nodeType == Node.ELEMENT_NODE ? (element as HTMLElement) : null;
                
                if (targetTag) {

                    while (targetTag != null) {
                        
                        if (!targetTag.parentElement) break;
                        if (Boolean(targetTag.parentElement.dataset.lexicalEditor)) break;
                        targetTag = targetTag.parentElement;
                    }
                }

                targetTag?.scrollIntoView({behavior: 'smooth', block: 'center'});
            }

            setEnter(false);
        }
    }

    return <>
        <OnChangePlugin onChange={onChange}></OnChangePlugin>
    </>

}