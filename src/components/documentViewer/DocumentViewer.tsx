import { styled } from "@mui/material";

const Frame = styled("iframe")(({theme}) => (
    {
        width: "100%",
        height: "100%",
        border: "none",
    }
));

const Container = styled("div")(({theme}) => (
    {
        width: "100%",
        height: "100%",
    }
));

export function DocumentViewer(props: { src: string }) {
    return <Container><Frame srcDoc={props.src}></Frame></Container>
}