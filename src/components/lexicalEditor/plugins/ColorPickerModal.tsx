import { styled } from "@mui/material";
import { useEffect, useState } from "react";
import { SketchPicker } from "react-color";

const Popover = styled("div")(({theme}) => (
{
    position: 'absolute',
    zIndex: '2',
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

export default function ColorPickerModal( props: { isShow: boolean, onClose: () => void }) {

    // const [isShowDisplay, setDisplayState] = useState(false);

    // useEffect(() => setDisplayState(props.isShow), [props.isShow])

    console.log(props.isShow);

    const handleClose = () => {
        // setDisplayState(false);
        props.onClose?.call(undefined);
    }

    return <>
        { props.isShow && <Popover>
            <Cover onClick={handleClose}></Cover>
            <SketchPicker/>
        </Popover>
        }
    </>
    
}