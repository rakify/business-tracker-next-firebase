import { forwardRef, useState } from "react";
import {
  Stack,
  Typography,
  Button,
  Container,
  Snackbar,
  Alert,
  Slide,
  Box,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../redux/apiCalls";

const Settings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const [inputs, setInputs] = useState({
    username: user.username || "",
    phoneNumber: user.phoneNumber || "",
    shopName: user.shopName || "",
    shopAddress: user.shopAddress || "",
    shopDetails: user.shopDetails || "",
    shopOfficePn: user.shopOfficePn || "",
    shopOtherPn: user.shopOtherPn || "",
  });

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const [response, setResponse] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      phoneNumber: inputs.phoneNumber,
      username: inputs.username,
      shopName: inputs.shopName,
      shopAddress: inputs.shopAddress,
      shopDetails: inputs.shopDetails,
      shopOfficePn: inputs.shopOfficePn,
      shopOtherPn: inputs.shopOtherPn,
    };
    updateUser(dispatch, user.uid, updatedUser).then((res) => {
      setResponse(res);
    });
  };

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{ backgroundColor: "whitesmoke", mt: 1 }}
        disableGutters
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 1, backgroundColor: "#83cee0", color: "white" }}
        >
          <Typography>Profile</Typography>
        </Stack>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1, ml: 5, mr: 5 }}
        >
          <TextField
            onChange={handleChange}
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            variant="standard"
            value={inputs?.username}
          />
          <TextField
            onChange={handleChange}
            margin="normal"
            required
            fullWidth
            id="phoneNumber"
            label="Your active phone number"
            name="phoneNumber"
            variant="standard"
            value={inputs?.phoneNumber}
          />
          <TextField
            onChange={handleChange}
            margin="normal"
            fullWidth
            id="shopName"
            label="Shop Name"
            name="shopName"
            variant="standard"
            value={inputs?.shopName}
          />
          <TextField
            onChange={handleChange}
            margin="normal"
            fullWidth
            id="shopAddress"
            label="Shop Address"
            name="shopAddress"
            variant="standard"
            value={inputs?.shopAddress}
          />
          <TextField
            onChange={handleChange}
            margin="normal"
            fullWidth
            id="shopDetails"
            label="Shop Details"
            name="shopDetails"
            variant="standard"
            value={inputs?.shopDetails}
          />
          <TextField
            onChange={handleChange}
            margin="normal"
            fullWidth
            id="shopOfficePn"
            label="Shop Office Phone"
            name="shopOfficePn"
            variant="standard"
            value={inputs?.shopOfficePn}
          />
          <TextField
            onChange={handleChange}
            margin="normal"
            fullWidth
            id="shopOtherPn"
            label="Shop Other Phone"
            name="shopOtherPn"
            variant="standard"
            value={inputs?.shopOtherPn}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Update
          </Button>
        </Box>

        {/* Display success message or error */}
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
    </>
  );
};

export default Settings;
