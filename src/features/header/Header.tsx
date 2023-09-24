import { AppBar, Box, Button, InputAdornment, OutlinedInput, Toolbar } from "@mui/material"
import { Search } from '@mui/icons-material';
import DivisionSelecotr from "./DivisionSelector";

function SearchTextField() {

    return <OutlinedInput sx={{ width: "70%" }} color="info"  id="input-with-icon-adornment"
      startAdornment={
        <InputAdornment position="start">
          <Search  />
        </InputAdornment>
      }/>
  }
  
export default function Header() {

  const click = () => {
    // a();
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar elevation={0} position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          
        <DivisionSelecotr></DivisionSelecotr>
        <SearchTextField />

          {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography> */}
          <Button onClick={click} color="inherit">AAAAA</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}