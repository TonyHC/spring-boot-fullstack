import { useState } from "react";
import { Link } from "react-router-dom";

import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import NavBar from "../navigation/Navbar";

const theme = createTheme({
  components: {
    // Name of the component
    MuiTextField: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          marginBottom: "24px",
          "& label.Mui-focused": {
            color: "#A0AAB4",
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: "#B2BAC2",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#E0E3E7",
            },
            "&:hover fieldset": {
              borderColor: "#B2BAC2",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#6F7E8C",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#E0E3E7",
          },
          "& .MuiOutlinedInput-input": {
            color: "#A0AAB4",
          },
        },
      },
    },
  },
});

const initialInputState = {
  email: "",
  password: "",
};

const Login = () => {
  const [inputState, setInputState] = useState(initialInputState);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setInputState((prevInputState) => {
      return {
        ...prevInputState,
        [name]: value,
      };
    });
  };

  const submitHandler = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log(inputState);

    // Send Login Request
  };

  return (
    <>
      <NavBar />
      <Box
        sx={{
          width: 380,
          height: 380,
          m: "auto",
          outline: "1px solid #E0E3E7",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
          p: 5,
        }}
      >
        <Typography
          variant="h3"
          component="h3"
          textAlign="center"
          fontFamily="monospace"
        >
          Sign in
        </Typography>
        <form onSubmit={submitHandler}>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            mt={3}
            flexGrow={1}
          >
            <ThemeProvider theme={theme}>
              <TextField
                fullWidth
                id="email"
                label="Email"
                name="email"
                type="text"
                variant="outlined"
                value={inputState.email}
                onChange={inputChangeHandler}
              />
              <TextField
                fullWidth
                id="password"
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                value={inputState.password}
                onChange={inputChangeHandler}
              />
            </ThemeProvider>
            <Button
              color="inherit"
              variant="outlined"
              type="submit"
              fullWidth
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                "&:hover": {
                  backgroundColor: "#6F7E8C",
                  boxShadow: "none",
                },
              }}
            >
              Sign in
            </Button>
            <Typography variant="caption" display="block" mt={3}>
              New to LOGO? <Link to="/sign-up">Join Now</Link>
            </Typography>
          </Stack>
        </form>
      </Box>
    </>
  );
};

export default Login;
