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
  Tooltip,
  Snackbar,
  Alert,
  Slide,
  DialogContentText,
  DialogActions,
  Box,
  Collapse,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import AddProduct from "../pages/products/add";
import { CloseRounded, DeleteOutlined, Edit } from "@mui/icons-material";
import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid";
import { deleteProduct, getProductData } from "../redux/apiCalls";
import QuickSearchToolbar from "../utils/QuickSearchToolbar";

const CollapseTransition = forwardRef(function Transition(props, ref) {
  return <Collapse ref={ref} {...props} />;
});
const SlideTransition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Products = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const products = useSelector((state) => state.product.products);

  useEffect(() => {
    getProductData(dispatch, user.uid);
  }, [dispatch, user]);

  const [deleteProductId, setDeleteProductId] = useState(false);
  const [response, setResponse] = useState(false);
  const [addNew, setAddNew] = useState(false);

  const handleDelete = () => {
    if (user.accountType !== "Seller" || !user.approved) {
      setResponse({
        type: "error",
        message: `You are not allowed to do that.`,
      });
    } else {
      setDeleteProductId(false);
      deleteProduct(dispatch, deleteProductId).then((res) => {
        res.type === "success" && getProductData(dispatch, user.uid);
        setResponse(res);
      });
    }
  };

  // when add new product successful AddProduct will return to this with response
  const handleCloseDialog = (res) => {
    setAddNew(false);
    getProductData(dispatch, user.uid);
    setResponse(res);
  };

  const columns = [
    {
      field: "createdAt",
      headerName: "Created At",
      headerClassName: "super-app-theme--header",
      width: 200,
      editable: false,
    },
    {
      field: "id",
      headerClassName: "super-app-theme--header",
      headerName: "ID",
      width: 200,
      editable: false,
    },
    {
      field: "name",
      headerName: "Name",
      headerClassName: "super-app-theme--header",
      width: 300,
      editable: false,
    },
    {
      field: "price",
      headerName: "Price",
      headerClassName: "super-app-theme--header",
      width: 150,
      editable: false,
    },
    {
      field: "stock",
      headerName: "Stock",
      headerClassName: "super-app-theme--header",
      width: 150,
      editable: false,
    },
    {
      field: "acceptCommission",
      headerName: "Commission",
      headerClassName: "super-app-theme--header",
      width: 150,
      editable: false,
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
          sx={{ p: 1, backgroundColor: "#8af", color: "white" }}
        >
          <Typography>List of Products</Typography>
          <Button
            variant="outlined"
            sx={{ color: "white" }}
            onClick={() => setAddNew(true)}
          >
            Add New
          </Button>
          {/* <Link href="/products/add">
            <Tooltip title="Add Product">
              <AddCircle fontSize="large" />
            </Tooltip>
          </Link> */}
        </Stack>

        <Box
          sx={{
            height: 500,
            width: "100%",
            "& .super-app-theme--header": {
              backgroundColor: "#2263a5",
              borderLeftWidth: 1,
              borderColor: "#f1f8ff",
              color: "white",
            },
          }}
        >
          <DataGrid
            headerHeight={30}
            localeText={{
              noRowsLabel: "No product has been added yet.",
            }}
            components={{ Toolbar: QuickSearchToolbar }}
            rows={products}
            getRowId={(row) => row.id}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            density="comfortable"
            initialState={{
              sorting: {
                sortModel: [{ field: "createdAt", sort: "desc" }],
              },
            }}
          />
        </Box>

        {/* Add New Product Dialog */}
        <Dialog
          open={Boolean(addNew)}
          TransitionComponent={CollapseTransition}
          keepMounted
          onClose={() => setAddNew(false)}
          aria-describedby="Add New Product"
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 1, backgroundColor: "#83cee0", color: "white" }}
          >
            <Typography>Add New Product</Typography>
            <Button size="small" onClick={() => setAddNew(false)}>
              <Tooltip title="Go back">
                <CloseRounded />
              </Tooltip>
            </Button>
          </Stack>
          <DialogContent>
            <AddProduct handleCloseDialog={handleCloseDialog} />
          </DialogContent>
        </Dialog>

        {/* Confirm Delete */}
        <Dialog
          open={Boolean(deleteProductId)}
          TransitionComponent={SlideTransition}
          keepMounted
          onClose={() => setDeleteProductId(false)}
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
            <Button onClick={() => setDeleteProductId(false)}>Cancel</Button>
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
