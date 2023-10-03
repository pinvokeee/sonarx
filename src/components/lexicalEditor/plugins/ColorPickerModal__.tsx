import { styled } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";
import { useEffect, useState } from "react";
import { ColorChangeHandler, ColorResult, SketchPicker } from "react-color";
import { SketchPickerStylesProps } from "react-color/lib/components/sketch/Sketch";
import {createPortal} from 'react-dom';

const Popover = styled("div")(({theme}) => (
{
    position: 'absolute',
    zIndex: "2",
}
));

const Cover = styled("div")(({theme}) => (
    {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
    }
    ));

export default function ColorPickerModal( props: 
    { 
        isShow: boolean, 
        color: string,
        // defaultColor: { r: Number, g: Number, b: Number  }, 
        onClose: () => void, 
        onColorChange: (color: string) => void,
        position: { x: Number, y: Number } 
    }) 
    {

    const handleClose = () => {
        // setDisplayState(false);
        console.log("ADAD");
        props.onClose?.call(undefined);
    }

    const onChange = (color: ColorResult, event: React.ChangeEvent<HTMLInputElement>) => {
        props.onColorChange?.call(undefined, color.hex);
    }

    const x = `${props.position.x}px`;
    const y = `${props.position.y}px`;

    return <>
        { props.isShow && <>
            <Cover onClick={handleClose}></Cover>
            { createPortal (<Popover sx={{ position: "absolute", top: y, left: x }}>
                <SketchPicker color={props.color} onChange={onChange}/>
            </Popover>, document.body) }
            </>
        }
    </>
    
}