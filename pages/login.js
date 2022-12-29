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
import { login } from "../redux/apiCalls";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Login({ from = "" }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [response, setResponse] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email === "")
      setResponse({ type: "warning", message: "Email is required" });
    else if (password === "")
      setResponse({ type: "warning", message: "Password is required." });
    else {
      setLoading(true);
      login(dispatch, email, password).then((res) => {
        setResponse(res);
        setLoading(false);
        res.type === "success" && from === "" && router.push("/");
      });
    }
  };

  return (
    <>
      <Head>
        <title>Login - Business Tracker</title>
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
            {from === "" ? "Sign in" : `Please login to continue to ${from}`}
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              variant="standard"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              disabled={loading}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? "Loading.." : "Sign In"}
            </Button>
            <Grid container>
              <Grid item xs>
                Forgot password?
                <Link href="/resetpass" variant="body2" sx={{ ml: 1 }}>
                  Reset Password
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
