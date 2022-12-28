import React, { useState } from "react";
import {
  Typography,
  TextField,
  Stack,
  Button,
  Checkbox,
  Box,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Container,
  Tooltip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { addProduct } from "../redux/apiCalls";
import Link from "next/link";
import { ArrowCircleLeft, ArrowLeft, SwipeLeftAlt } from "@mui/icons-material";

const AddProduct = ({ handleCloseDialog }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const [response, setResponse] = useState(false);
  const [checked, setChecked] = useState(false);

  const [inputs, setInputs] = useState({
    name: "",
    price: "",
    unit: "",
    note: "",
    stock: 0,
  });
  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      inputs.name === "" ||
      inputs.price === "" ||
      inputs.price <= 0 ||
      isNaN(inputs.price) ||
      inputs.stock < 0 ||
      inputs.stock === ""
    ) {
      setResponse({
        type: "error",
        message: `Name and Price is required.\n Price must be greater than 0.\n Stock must be greater than or equal to 0.`,
      });
    } else {
      let newProduct = {
        uid: user.uid,
        id: uuidv4(),
        name: inputs.name,
        price: parseFloat(inputs.price),
        unit: inputs.unit,
        note: inputs.note,
        stock: parseInt(inputs.stock),
        acceptCommission: Boolean(checked),
        createdAt: new Date().toLocaleString("en-us"),
      };

      const res = await addProduct(dispatch, newProduct);
      setResponse(res);
      //01902215404
    }
  };
  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ backgroundColor: "whitesmoke" }}
      disableGutters
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <FormControl fullWidth margin="normal" required focused>
          <InputLabel htmlFor="name">Name</InputLabel>
          <Input
            aria-describedby="name-helper-text"
            name="name"
            id="name"
            onChange={(e) => handleChange(e)}
            autoFocus
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
          <InputLabel htmlFor="price">Price</InputLabel>
          <Input
            aria-describedby="price-helper-text"
            name="price"
            id="price"
            onChange={(e) => handleChange(e)}
          />
          <FormHelperText id="price-helper-text">
            Minimum price of product is 1.
          </FormHelperText>
        </FormControl>

        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="unit">Unit</InputLabel>
          <Input
            aria-describedby="unit-helper-text"
            name="unit"
            id="unit"
            onChange={(e) => handleChange(e)}
          />
          <FormHelperText id="unit-helper-text">
            Unit is optional. It can be Kg, Piece, Packet, Liter etc.
          </FormHelperText>
        </FormControl>

        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="note">Note</InputLabel>
          <Input
            aria-describedby="note-helper-text"
            name="note"
            id="note"
            onChange={(e) => handleChange(e)}
          />
          <FormHelperText id="note-helper-text">
            Note is optional. It can be anything to describe the product.
          </FormHelperText>
        </FormControl>

        <FormControl
          margin="normal"
          fullWidth
          required
          error={inputs.stock !== "" && inputs.stock < 0}
        >
          <InputLabel htmlFor="stock">Stock</InputLabel>
          <Input
            aria-describedby="stock-helper-text"
            name="stock"
            id="stock"
            onChange={(e) => handleChange(e)}
          />
          <FormHelperText id="stock-helper-text">
            Minimum stock of product is 0.
          </FormHelperText>
        </FormControl>

        <Stack direction="row" alignItems="center" justifyContent="center">
          <Checkbox
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <Typography>Accept Commission</Typography>
        </Stack>

        <Button type="submit" fullWidth variant="contained">
          Add
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
};

export default AddProduct;
