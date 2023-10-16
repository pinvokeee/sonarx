import { useEffect, useRef, useState } from "react";
import ColorPickerModal from "../ColorPickerModal";
import { ToolBarButton } from "./ToolBarButton";
import React from "react";

export default function ToolBarButtonColorPicker( props: 
    {
        color: string, 
        onChangeColor: (color: string) => void,
        children: React.ReactNode,
    } ) {
    
    const color = props.color;

    const [showModal, setModal] = useState(false);
    const ref = useRef<HTMLButtonElement>(null);

    const [posX, setPosX] = useState(0);
    const [posY, setPosY] = useState(0);

    useEffect(() => {
        const bdbox = ref?.current?.getBoundingClientRect();
        if (!bdbox) return;
        setPosX(bdbox.x - (bdbox.width));
        setPosY(bdbox.y + bdbox.height);

    }, [showModal]);

    const handleColor = (event: React.MouseEvent<HTMLElement>) => {
        setModal(true);
    }

    const handleCloseModal = () => {
        setModal(false);
    }
    
    const handleChangeColor = (color: string, isComplete: boolean) => {
        props.onChangeColor?.call(undefined, color);
        if (isComplete) setModal(false);
    }

    return (
        <>
        <ToolBarButton ref={ref} onClick={handleColor} value="color" sx={{ color }}>
            { props.children }
        </ToolBarButton>
        <ColorPickerModal 
            onColorChange={handleChangeColor} 
            color={color} 
            isShow={showModal} 
            onClose={handleCloseModal}
            position={ {x: posX, y: posY} }
            ></ColorPickerModal>
        </>
    );
}