import React, { useState } from "react";
import {
  Typography,
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
import { updateProduct } from "../redux/apiCalls";
import Link from "next/link";
import { ArrowCircleLeft } from "@mui/icons-material";
import { useRouter } from "next/router";

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;

  const user = useSelector((state) => state.user.currentUser);

  const dispatch = useDispatch();
  const [response, setResponse] = useState(false);

  // get product info from redux
  const product = useSelector((state) =>
    state.product.products.find((product) => product.id === id)
  );

  const [checked, setChecked] = useState(product?.acceptCommission);

  const [inputs, setInputs] = useState({
    id: product?.id,
    name: product?.name,
    price: product?.price,
    unit: product?.unit,
    note: product?.note,
    stock: product?.stock,
  });
  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = (e) => {
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
    } else if (user.accountType !== "Seller" || !user.approved) {
      setResponse({
        type: "error",
        message: `You are not allowed to do that.`,
      });
    } else {
      let newProduct = {
        uid: user.uid,
        id: id,
        name: inputs.name,
        price: parseFloat(inputs.price),
        unit: inputs.unit,
        note: inputs.note,
        stock: parseInt(inputs.stock),
        acceptCommission: Boolean(checked),
        createdAt: new Date().toLocaleString("en-us"),
      };

      updateProduct(dispatch, id, newProduct).then((res) => {
        setResponse(res);
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
        <Typography>Edit Product</Typography>
        <Link href="/products">
          <Tooltip title="Go back">
            <ArrowCircleLeft fontSize="large" />
          </Tooltip>
        </Link>
      </Stack>

      {!product ? (
        <Typography style={{ fontSize: 20 }}>
          Product does not exist.
        </Typography>
      ) : (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <FormControl fullWidth margin="normal" required focused>
            <InputLabel htmlFor="name">Name</InputLabel>
            <Input
              aria-describedby="name-helper-text"
              name="name"
              id="name"
              value={inputs.name}
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
            <InputLabel htmlFor="price">Price</InputLabel>
            <Input
              aria-describedby="price-helper-text"
              name="price"
              id="price"
              value={inputs.price}
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
              value={inputs.unit}
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
              value={inputs.note}
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
              value={inputs.stock}
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
            Submit
          </Button>
        </Box>
      )}

      {/* Display EditProduct success message or error */}
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
