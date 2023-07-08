import { useState } from "react";

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
  firstName: "",
  lastName: "",
  email: "",
  age: "",
};

const SignUp = () => {
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
    // Send Sign up Request
  };

  return (
    <>
      <NavBar />
      <Box
        sx={{
          width: 380,
          height: 500,
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
          Sign up
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
                id="firstName"
                label="First Name"
                name="firstName"
                type="text"
                variant="outlined"
                value={inputState.firstName}
                onChange={inputChangeHandler}
              />
              <TextField
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                type="text"
                variant="outlined"
                value={inputState.lastName}
                onChange={inputChangeHandler}
              />
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
                id="age"
                label="Age"
                name="age"
                variant="outlined"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                value={inputState.age}
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
              Sign up
            </Button>
          </Stack>
        </form>
      </Box>
    </>
  );
};

export default SignUp;
