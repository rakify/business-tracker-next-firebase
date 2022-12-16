import { forwardRef, useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Fab,
  Tooltip,
  Snackbar,
  Alert,
  Slide,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import AddProduct from "../pages/products/add";
import {
  Add,
  AddCircle,
  Close,
  DeleteOutlined,
  Edit,
} from "@mui/icons-material";
import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid";
import { deleteProduct, getProductData } from "../redux/apiCalls";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Products = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const products = useSelector((state) => state.product.products);

  useEffect(() => {
    getProductData(dispatch, user.uid);
  }, [dispatch, user]);

  const [editProduct, setEditProduct] = useState();
  const [editProductPosition, setEditProductPosition] = useState();
  const [deleteProductId, setDeleteProductId] = useState(false);
  const [response, setResponse] = useState(false);

  const handleDelete = () => {
    setDeleteProductId(false);
    deleteProduct(dispatch, deleteProductId).then((res) => {
      res.type === "success" && getProductData(dispatch, user.uid);
      setResponse(res);
    });
  };

  const handleCloseDialog = () => {
    setDeleteProductId(false);
  };

  const columns = [
    {
      field: "id",
      headerClassName: "super-app-theme--header",
      headerName: "Product ID",
      width: 200,
      editable: true,
    },
    {
      field: "name",
      headerName: "Product",
      headerClassName: "super-app-theme--header",
      width: 300,
      editable: true,
      // renderCell: (params) => {
      //   return (
      //     <Stack direction="row" alignItems="center" sx={{ gap: 2 }}>
      //       <Avatar src={params.row.img} alt="" />
      //       <Typography>{params.row.title}</Typography>
      //     </Stack>
      //   );
      // },
    },
    {
      field: "price",
      headerName: "Price",
      headerClassName: "super-app-theme--header",
      width: 150,
      editable: true,
    },
    {
      field: "stock",
      headerName: "Stock",
      headerClassName: "super-app-theme--header",
      width: 150,
      editable: true,
    },
    {
      field: "acceptCommission",
      headerName: "Commission",
      headerClassName: "super-app-theme--header",
      width: 150,
      editable: true,
    },
    {
      field: "unit",
      headerName: "Unit",
      headerClassName: "super-app-theme--header",
      width: 200,
      editable: true,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      headerClassName: "super-app-theme--header",
      width: 200,
      editable: true,
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "super-app-theme--header",
      width: 150,
      renderCell: (params) => {
        return (
          <Stack direction="row" alignItems="center" sx={{ gap: 2 }}>
            <Link
              href={`/products/edit/${params.row.id}`}
              underline="none"
              color="inherit"
            >
              <IconButton aria-label="edit">
                <Tooltip title="Edit">
                  <Edit />
                </Tooltip>
              </IconButton>
            </Link>
            <IconButton
              aria-label="delete"
              onClick={() => setDeleteProductId(params.row.id)}
            >
              <Tooltip title="Delete">
                <DeleteOutlined />
              </Tooltip>
            </IconButton>
          </Stack>
        );
      },
    },
  ];

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
          <Typography>List of Products</Typography>
          <Link href="/products/add">
            <Tooltip title="Add Product">
              <AddCircle fontSize="large" />
            </Tooltip>
          </Link>
        </Stack>

        {products.length === 0 ? (
          <Typography
            sx={{
              color: "red",
              fontSize: 20,
              backgroundColor: "whitesmoke",
              padding: 20,
            }}
          >
            No product added yet.
          </Typography>
        ) : (
          <DataGrid
            rows={products}
            getRowId={(row) => row.id}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            density="comfortable"
            sx={{ height: 500 }}
            initialState={{
              sorting: {
                sortModel: [{ field: "createdAt", sort: "desc" }],
              },
            }}
          />
        )}

        {/* Confirm Delete */}
        <Dialog
          open={Boolean(deleteProductId)}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseDialog}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Confirm Delete"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              If you proceed now product with ID {deleteProductId} will be
              erased. This action is irreversible.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={() => handleDelete(deleteProductId)}>
              Proceed
            </Button>
          </DialogActions>
        </Dialog>

        {/* Display deleteProduct success message or error */}
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

export default Products;
