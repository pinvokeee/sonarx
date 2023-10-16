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

const SingleColorButton = styled("button")(({theme}) => (
    {
        width: "16px",
        height: "16px",
        border: "1px solid #e8e9ec",
    }
));

const NoBorderColorButton = styled("button")(({theme}) => (
    {
        width: "14px",
        height: "14px",
        border: "none",
    }
));

const ColLinePalette = styled("div")(({theme}) => (
    {
        display: "flex",
        gap: "4px",
    }
));

const RowLinePalette = styled("div")(({theme}) => (
    {
        display: "flex",
        flexDirection: "column",
        border: "1px solid #e8e9ec",
    }
));


export default function ColorPickerModal( props: 
    { 
        isShow: boolean, 
        color: string,
        // defaultColor: { r: Number, g: Number, b: Number  }, 
        onClose: () => void, 
        onColorChange: (color: string, isComplete: boolean) => void,
        position: { x: Number, y: Number } 
    }) 
    {

    const handleClose = () => {
        props.onClose?.call(undefined);
    }

    const onChange = (color: string, isComplete: boolean) => {
        props.onColorChange?.call(undefined, color, isComplete);
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

export function ColorPicker( props: { color: string, onChange: (color: string, isComplete: boolean) => void } ) {

    const theme_colors_1 = [
        "#ffffff",
        "#000000",
        "#e7e6e6",
        "#44546a",
        "#4472c4",
        "#ed7d31",
        "#a5a5a5",
        "#ffc000",
        "#5a99d2",
        "#70ad47",
    ];

    const colors_2 = [
        ["#f2f2f2", "#d8d8d8", "#bfbfbf", "#a5a5a5", "#7f7f7f"],
        ["#7f7f7f", "#595959", "#3f3f3f", "#262626", "#0c0c0c"],
        ["#d0cece", "#aeabab", "#757070", "#3a3838", "#171616"],
        ["#d6dce4", "#adb9ca", "#8496b0", "#323f4f", "#222a35"],
        ["#d9e2f3", "#b4c6e7", "#8eaadb", "#2f5496", "#1f3864"],
        ["#fbe5d5", "#f7cbac", "#f4b183", "#c55a11", "#833c0b"],
        ["#ededed", "#dbdbdb", "#c9c9c9", "#7b7b7b", "#525252"],
        ["#fff2cc", "#fee599", "#ffd965", "#bf9000", "#7f6000"],
        ["#deebf6", "#bdd7ee", "#9cc3e5", "#2e75b5", "#1e4e79"],
        ["#e2efd9", "#c5e0b3", "#a8d08d", "#538135", "#375623"],
    ];

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
        props.onChange?.call(undefined, event.currentTarget.value, true);
    }

    
    const onColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // event.preventDefault();
        props.onChange?.call(undefined, event.currentTarget.value, false);
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
                <ColLinePalette>
                {
                    theme_colors_1.map(color => <SingleColorButton onClick={onClick} value={color} className="colorpicker block" style={{ backgroundColor: color }}></SingleColorButton>)
                }
                </ColLinePalette>
                <ColLinePalette>
                {
                    colors_2.map(rcolors => {
                        return (

                            <RowLinePalette>
                            {
                                rcolors.map(color => <NoBorderColorButton onClick={onClick} value={color} className="colorpicker block" style={{ backgroundColor: color }}></NoBorderColorButton>)
                            }   
                            </RowLinePalette>
                        );
                    })
                }
                </ColLinePalette>
                {/* {
                    colors.map(color => <button onClick={onClick} value={color} className="colorpicker block" style={{ backgroundColor: color }}></button>)
                } */}
            </div>
            <hr></hr>
            <input type="color" onChange={onColorChange} defaultValue={props.color}></input>
            <div></div>
        </div>
    </>
}