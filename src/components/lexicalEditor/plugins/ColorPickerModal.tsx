import { styled } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";
import { useEffect, useState } from "react";
import { ColorChangeHandler, ColorResult, SketchPicker } from "react-color";
import { SketchPickerStylesProps } from "react-color/lib/components/sketch/Sketch";
import {createPortal} from 'react-dom';
import "./ColorPicker.css";

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
        props.onClose?.call(undefined);
    }

    const onChange = (color: string) => {
        props.onColorChange?.call(undefined, color);
    }

    const x = `${props.position.x}px`;
    const y = `${props.position.y}px`;

    return <>
        { props.isShow && <>
            <Cover onClick={handleClose}></Cover>
            { createPortal (<Popover sx={{ position: "absolute", top: y, left: x }}>
                {/* <SketchPicker color={props.color} onChange={onChange}/> */}
                <ColorPicker color={props.color} onChange={onChange}></ColorPicker>
            </Popover>, document.body) }
            </>
        }
    </>
    
}

export function ColorPicker( props: { color: string, onChange: (color: string) => void } ) {

    const colors = [
        "red",
        "blue",
        "green",
        "yellow",
        "pink",
        "darkred",
        "darkblue",
        "red",
        "blue",
        "green",
        "yellow",
        "pink",
        "darkred",
        "#ff7688",
    ]

    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        props.onChange?.call(undefined, event.currentTarget.value);
    }

    const DivClickK = (event: React.MouseEvent<HTMLDivElement>) => {        
        event.preventDefault();
        event.cancelable = true;
        event.stopPropagation();
    }

    console.log(props.color);

    return <>
        <div onMouseDown={DivClickK} className="colorpicker container">
            <div onMouseDown={DivClickK} className="colorpicker colorcontainer">
                {
                    colors.map(color => <button onClick={onClick} value={color} className="colorpicker block" style={{ backgroundColor: color }}></button>)
                }
            </div>
            <hr></hr>
            <input type="color" defaultValue={props.color}></input>
            <div></div>
        </div>
    </>
}