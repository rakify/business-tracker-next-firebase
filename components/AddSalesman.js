import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Alert, FormControl, FormHelperText, Input, InputLabel, Snackbar, Stack, Tooltip } from "@mui/material";
import Link from "next/link";
import { addSalesmanData } from "../redux/apiCalls";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ArrowCircleLeft } from "@mui/icons-material";

export default function AddSalesman() {
  const user = useSelector((state) => state.user.currentUser); // Owner

  const [response, setResponse] = useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

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
        phoneNumber,
        createdAt: userCredential.user.metadata.creationTime,
        lastLoginAt: userCredential.user.metadata.lastSignInTime,
        ...inputs,
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
    <Container
      maxWidth="xs"
      sx={{ backgroundColor: "whitesmoke", mt: 1 }}
      disableGutters
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ p: 1, backgroundColor: "#83cee0", color: "white" }}
      >
        <Typography>Add New Salesman</Typography>
        <Link href="/salesman">
          <Tooltip title="Go back">
            <ArrowCircleLeft fontSize="large" />
          </Tooltip>
        </Link>
      </Stack>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <FormControl fullWidth margin="normal" required focused>
          <InputLabel htmlFor="name">Name</InputLabel>
          <Input
            aria-describedby="name-helper-text"
            name="name"
            id="name"
            onChange={(e) => handleChange(e)}
          />
          <FormHelperText id="name-helper-text">
            Name is required.
          </FormHelperText>
        </FormControl>

        <FormControl
          margin="normal"
          fullWidth
          required
          error={inputs.price !== "" && inputs.price <= 0}
        >
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input
            aria-describedby="email-helper-text"
            name="email"
            id="email"
            onChange={(e) => handleChange(e)}
          />
          <FormHelperText id="email-helper-text">
            Email is required.
          </FormHelperText>
        </FormControl>

        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="phoneNumber">Phone Number</InputLabel>
          <Input
            aria-describedby="phoneNumber-helper-text"
            name="phoneNumber"
            id="phoneNumber"
            onChange={(e) => handleChange(e)}
          />
          <FormHelperText id="phoneNumber-helper-text">
            Phone Number is optional.
          </FormHelperText>
        </FormControl>

        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            aria-describedby="password-helper-text"
            name="password"
            id="password"
            type="password"
            onChange={(e) => handleChange(e)}
          />
          <FormHelperText id="password-helper-text">
            Minimum password length is 6 characters.
          </FormHelperText>
        </FormControl>
        <Button type="submit" fullWidth variant="contained">
          Add Salesman
        </Button>
      </Box>

      {/* Display AddProduct success message or error */}
      <Snackbar
        open={Boolean(response)}
        autoHideDuration={4000}
        onClose={() => setResponse(false)}
      >
        <Alert
          onClose={() => setResponse(false)}
          severity={response?.type}
          sx={{ width: "100%" }}
        >
          {response?.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
