import { AppBar, ToggleButton, ToggleButtonGroup, Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/system";

export const Offset = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1, 0, 2),
  ...theme.mixins.toolbar,
  justifyContent: "space-between",
}));

function NavBar({ lang, handleLangChange }) {
  return (
    <>
      <AppBar className="navbar" position="fixed">
        <Toolbar className="navbar__tool">
          <img className="navbar__logo" src="/logo.png" alt="TM" />
          <Typography className="navbar__logo-text" variant="h6" component="span">
            TM
          </Typography>
          <ToggleButtonGroup value={lang} exclusive onChange={handleLangChange} size="small">
            <ToggleButton value="ru">РУС</ToggleButton>
            <ToggleButton value="kk">ҚАЗ</ToggleButton>
            <ToggleButton value="en">ENG</ToggleButton>
          </ToggleButtonGroup>
        </Toolbar>
      </AppBar>
      <Offset className="navbar__offset" />
    </>
  );
}

export default NavBar;
