import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import Link from "next/link";
import { addUserData, getUserData } from "../redux/apiCalls";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function Register() {
  const [response, setResponse] = useState(false);
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const userInfo = {
          uid: userCredential.user.uid,
          username,
          email,
          phoneNumber,
          createdAt: userCredential.user.metadata.creationTime,
          lastLoginAt: userCredential.user.metadata.lastSignInTime,
          approved: false,
          accountType: "Seller",
        };
        addUserData(userInfo).then((res) => {
          setResponse(res);
        });
      })
      .catch((error) => {
        setResponse({
          type: "error",
          message:
            error.code === "auth/invalid-email"
              ? "Invalid email."
              : error.code === "auth/email-already-in-use"
              ? "This email is already in use."
              : error.code === "auth/weak-password"
              ? "Password must contain at least 6 characters."
              : "Network error.",
        });
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Create a Account
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
            fullWidth
            id="username"
            label="What should we call you?"
            name="username"
            autoFocus
            variant="standard"
          />
          <TextField
            onChange={(e) => setPhoneNumber(e.target.value)}
            margin="normal"
            required
            fullWidth
            id="phoneNumber"
            label="Your active phone number"
            name="phoneNumber"
            variant="standard"
          />
          <TextField
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Your active email"
            name="email"
            variant="standard"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password must be greater than 6 characters"
            type="password"
            id="password"
            variant="standard"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container>
            <Grid item xs>
              Forgot password?
              <Link href="" variant="body2" sx={{ ml: 1 }}>
                Reset Password
              </Link>
            </Grid>
            <Grid item>
              Already have an account?{" "}
              <Link href="/login" sx={{ ml: 1, textDecoration: "none" }}>
                Log In
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Display Register success message or error */}
      <Snackbar
        open={Boolean(response)}
        autoHideDuration={4000}
        onClose={() => setResponse(false)}
      >
        <Alert
          onClose={() => setResponse(false)}
          severity={response.type}
          sx={{ width: "100%" }}
        >
          {response?.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
