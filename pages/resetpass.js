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
import { getProductData, getUserData, resetPassword } from "../redux/apiCalls";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import Head from "next/head";

export default function ResetPass() {
  const [response, setResponse] = useState(false);
  const [email, setEmail] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    if (email === "")
      setResponse({ type: "warning", message: "Email is required" });
    else {
      resetPassword(email).then((res) => {
        res === 200 &&
          setResponse({
            type: "success",
            message:
              "We have sent an email with instruction on how to reset your password. Please check spam folders also.",
          });
        res !== 200 &&
          setResponse({
            type: "error",
            message:
              "Could not reset. Please check if email address you provided is correct.",
          });
      });
    }
  };

  return (
    <>
      <Head>
        <title>Reset Password - Business Tracker</title>
        <meta
          name="description"
          content="Business tracker is a web application for business people to record and to calculate their sells faster"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
            Reset Password
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoFocus
              variant="standard"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset Password
            </Button>
            <Grid container>
              <Grid item xs>
                Already have an account?{" "}
                <Link href="/login" sx={{ ml: 1, textDecoration: "none" }}>
                  Log In
                </Link>
              </Grid>
              <Grid item>
                Don't have an account?{" "}
                <Link href="/register" sx={{ ml: 1, textDecoration: "none" }}>
                  Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Display login success message or error */}
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
    </>
  );
}
