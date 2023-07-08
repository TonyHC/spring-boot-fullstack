import { useNavigate } from "react-router-dom";
import { Button, Container, Stack, Typography } from "@mui/material";

import NavBar from "../navigation/Navbar";

import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "monospace",
          fontWeight: 700,
          "&:hover": {
            backgroundColor: "#90a4ae",
            boxShadow: "none",
          },
        },
      },
    },
  },
});

const Landing = () => {
  const navigate = useNavigate();

  const loginClickHandler = () => {
    navigate("/login");
  };

  const signUpClickHandler = () => {
    navigate("/sign-up");
  };

  return (
    <>
      <NavBar />
      <Container maxWidth="sm" sx={{ flexGrow: 1, textAlign: "center", m: 'auto' }}>
        <Typography variant="h2" component="h2">
          Landing Page
        </Typography>
        <Typography variant="subtitle2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
          marginTop={3}
        >
          <ThemeProvider theme={theme}>
            <Button
              color="inherit"
              variant="outlined"
              onClick={loginClickHandler}
            >
              Login
            </Button>
            <Button
              color="inherit"
              variant="outlined"
              onClick={signUpClickHandler}
            >
              Sign up
            </Button>
          </ThemeProvider>
        </Stack>
      </Container>
    </>
  );
};

export default Landing;
