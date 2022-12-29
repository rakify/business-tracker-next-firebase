import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Alert, Divider, Snackbar, Typography } from "@mui/material";
import { addSalesmanData, addUserData, getUserData } from "../redux/apiCalls";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function AddSalesman({ handleCloseDialog }) {
  const user = useSelector((state) => state.user.currentUser); // Owner

  const [response, setResponse] = useState(false);
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState(user.shopName || "");
  const [shopAddress, setShopAddress] = useState(user.shopAddress || "");
  const [shopDetails, setShopDetails] = useState(user.shopDetails || "");
  const [shopOfficePn, setShopOfficePn] = useState(user.shopOfficePn || "");
  const [shopOtherPn, setShopOtherPn] = useState(user.shopOtherPn || "");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (user.accountType !== "Seller") {
      setResponse({
        type: "error",
        message: `You are not allowed to do that.`,
      });
    }
    {
      setLoading(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const userInfo = {
          uid: user.uid, // Seller uid
          salesmanUid: userCredential.user.uid, // Salesman uid
          username, // Sellsman name
          email,
          phoneNumber,
          createdAt: userCredential.user.metadata.creationTime,
          lastLoginAt: userCredential.user.metadata.lastSignInTime,
          approved: true,
          accountType: "Salesman",
          shopName,
          shopAddress,
          shopDetails,
          shopOfficePn,
          shopOtherPn,
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
          <Box sx={{ border: "1px solid #9af", padding: 2 }}>
            <Typography sx={{ backgroundColor: "#9af", p: 1 }}>
              Account Information
            </Typography>
            <TextField
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              fullWidth
              id="username"
              label="Salesman Username"
              name="username"
              autoFocus
              variant="standard"
            />
            <TextField
              onChange={(e) => setPhoneNumber(e.target.value)}
              margin="normal"
              required
              fullWidth
              type="number"
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
              type="email"
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
          </Box>
          <Divider />
          <Box sx={{ border: "1px solid #9af", padding: 2 }}>
            <Typography sx={{ backgroundColor: "#9af", p: 1 }}>
              Shop Information
            </Typography>

            <TextField
              defaultValue={shopName}
              margin="normal"
              required
              fullWidth
              name="shopName"
              label="Shop Name"
              type="shopName"
              id="shopName"
              variant="standard"
              onChange={(e) => setShopName(e.target.value)}
            />
            <TextField
              defaultValue={shopAddress}
              margin="normal"
              required
              fullWidth
              name="shopAddress"
              label="Address"
              id="shopAddress"
              variant="standard"
              onChange={(e) => setShopAddress(e.target.value)}
            />
            <TextField
              defaultValue={shopDetails}
              margin="normal"
              required
              fullWidth
              name="shopDetails"
              label="Details"
              id="shopDetails"
              variant="standard"
              onChange={(e) => setShopDetails(e.target.value)}
            />
            <TextField
              defaultValue={shopOfficePn}
              margin="normal"
              required
              fullWidth
              name="shopOfficePn"
              label="Office Phone Number"
              type="number"
              id="shopOfficePn"
              variant="standard"
              onChange={(e) => setShopOfficePn(e.target.value)}
            />
            <TextField
              defaultValue={shopOtherPn}
              margin="normal"
              required
              fullWidth
              name="shopOtherPn"
              label="Other Phone Number"
              type="number"
              id="shopOtherPn"
              variant="standard"
              onChange={(e) => setShopOtherPn(e.target.value)}
            />
          </Box>
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
