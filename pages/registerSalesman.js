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
import { addSalesmanData, addUserData, getUserData } from "../redux/apiCalls";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Head from "next/head";

export default function RegisterSalesman() {
  const [response, setResponse] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const user = useSelector((state) => state.user.currentUser); // Owner

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userInfo = {
        uid: user.uid, // Seller uid
        username: user.username, // Seller username
        salesmanUid: userCredential.user.uid, // Salesman uid
        name, // Salesman name
        email,
        phoneNumber,
        createdAt: userCredential.user.metadata.creationTime,
        lastLoginAt: userCredential.user.metadata.lastSignInTime,
        approved: true,
        accountType: "Salesman",
      };
      const res = await addSalesmanData(userInfo);
       setResponse(res);
    } catch (error) {
      console.log(error);
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
    }
  };

  return (
    <>
      <Head>
        <title>Register - Business Tracker</title>
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
            Create a Salesman Account
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
              fullWidth
              id="name"
              label="Salesman Name"
              name="name"
              autoFocus
              variant="standard"
            />
            <TextField
              onChange={(e) => setPhoneNumber(e.target.value)}
              margin="normal"
              required
              fullWidth
              id="phoneNumber"
              label="Phone number"
              name="phoneNumber"
              variant="standard"
            />
            <TextField
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Active email"
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
              Add Salesman
            </Button>
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
    </>
  );
}
