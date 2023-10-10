import { Button, SxProps, Theme, ToggleButton, styled } from "@mui/material";
import { forwardRef } from "react";

export const ToolBarButtonStyle = styled(Button)(({ theme }) => ({

    '&.MuiButton-root': {
        "minWidth": "0px",
        verticalAlign: "top",
        "padding": "7px",
    },

    // '&:hover': {
    //     border: "none",        
    //     backgroundColor: 'transparent',
    //     boxShadow: 'none',
    // },

    // '&:active': {
    //     border: "none",
    //     boxShadow: 'none',
    //     backgroundColor: 'transparent',
    // },

    // '&:focus': {
    //     border: "none",
    //     boxShadow: 'none',
    //     backgroundColor: 'transparent',
    // },
}));

export type IToolBarProp = {
    children: React.ReactNode,
    onClick: (event: React.MouseEvent<HTMLElement>) => void,
    value: string,
    sx?: SxProps<Theme> | undefined,
}

export const ToolBarButton = forwardRef<HTMLButtonElement, IToolBarProp>(( props, ref ) => {
    return <ToolBarButtonStyle size="small" value={props.value} ref={ref} onClick={props.onClick} sx={props.sx}>{ props.children }</ToolBarButtonStyle>
});

// export const ToolBarButton = forwardRef<HTMLButtonElement, any>( props: { children: React.ReactNode,  }, ref ) => {
//     // const 
//     return <ToolBarButtonStyle ref={ref}>{ props.children }</ToolBarButtonStyle>;
//     // return <div ref={ref}><ToolBarButtonStyle onClick={props.onClick} sx={props.sx}>{ props.children }</ToolBarButtonStyle></div>;
// };
