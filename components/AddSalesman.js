import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import { addSalesmanData, addUserData, getUserData } from "../redux/apiCalls";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function AddSalesman({ handleCloseDialog }) {
  const [response, setResponse] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user.currentUser); // Owner

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
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
      handleCloseDialog(res);
      setLoading(false);
    } catch (error) {
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
      setLoading(false);
    }
  };

  return (
    <>
      <Container
        component="main"
        maxWidth="xs"
        disableGutters
        sx={{ backgroundColor: "whitesmoke" }}
      >
        <Box component="form" onSubmit={handleSubmit}>
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
            disabled={loading}
          >
            {loading ? "Loading.." : "Add"}
          </Button>
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
