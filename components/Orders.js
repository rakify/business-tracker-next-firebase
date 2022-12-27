import { forwardRef, useEffect, useState, React } from "react";
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
  TextField,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import AddProduct from "../pages/products/add";
import {
  Add,
  AddCircle,
  Clear,
  Close,
  DeleteOutlined,
  Edit,
  EditOutlined,
  Search,
} from "@mui/icons-material";
import Link from "next/link";
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import {
  deleteOrder,
  deleteProduct,
  getOrderData,
  getProductData,
  updateProductQuantity,
} from "../redux/apiCalls";
import QuickSearchToolbar from "../utils/QuickSearchToolbar";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Orders = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteOrderInfo, setDeleteOrderInfo] = useState(false);
  const [response, setResponse] = useState(false);

  useEffect(() => {
    setLoading(true);
    getOrderData(user.uid).then((res) => {
      setOrders(res);
      setLoading(false);
    });
  }, []);

  const handleDelete = async () => {
    // place order
    try {
      setLoading(true);
      await deleteOrder(deleteOrderInfo.id);
      //handle stock update
      for (const key in deleteOrderInfo.quantity) {
        await updateProductQuantity(
          key,
          deleteOrderInfo.quantity[key],
          "inc"
        ).then((res) => console.log(res));
      }
      for (const key in deleteOrderInfo.quantity2) {
        await updateProductQuantity(
          key,
          deleteOrderInfo.quantity2[key],
          "inc"
        ).then((res) => console.log(res));
      }

      await getOrderData(user.uid).then((res) => {
        setOrders(res);
      });

      setDeleteOrderInfo(false);
      const newOrders = await getOrderData(user.uid);
      setOrders(newOrders);

      setResponse({
        type: "success",
        message: "Order deleted successfully.",
      });
      setLoading(false);
    } catch (err) {
      setDeleteOrderInfo(false);
      setLoading(false);
      setResponse({
        type: "error",
        message: err.message,
      });
    }
  };

  const handleCloseDialog = () => {
    setDeleteOrderInfo(false);
  };

  const columns = [
    {
      field: "createdAt",
      headerName: "Created At",
      headerClassName: "super-app-theme--header",
      width: 180,
      editable: false,
    },
    {
      field: "entryNo",
      headerClassName: "super-app-theme--header",
      headerName: "No.",
      width: 50,
      editable: false,
    },
    {
      field: "customerName",
      headerName: "Customer",
      headerClassName: "super-app-theme--header",
      width: 150,
      editable: false,
    },
    {
      field: "customerContact",
      headerName: "Contact",
      headerClassName: "super-app-theme--header",
      width: 150,
      editable: false,
    },
    {
      field: "finalReserve",
      headerName: "Final Reserve",
      headerClassName: "super-app-theme--header",
      width: 150,
      editable: false,
    },
    {
      field: "preparedBy",
      headerName: "Prepared By",
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
            <IconButton
              aria-label="delete"
              onClick={() => setDeleteOrderInfo(params.row)}
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
        maxWidth="xl"
        sx={{ backgroundColor: "whitesmoke", mt: 1 }}
        disableGutters
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 1, backgroundColor: "#83cee0", color: "white" }}
        >
          <Typography>List of Orders</Typography>
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
              height: "50px !important",
            },
          }}
        >
          <DataGrid
            localeText={{
              noRowsLabel: "No order has been placed yet.",
            }}
            loading={loading}
            components={{ Toolbar: QuickSearchToolbar }}
            rows={orders}
            getRowId={(row) => row.entryNo}
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
        </Box>

        {/* Confirm Delete */}
        <Dialog
          open={Boolean(deleteOrderInfo)}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseDialog}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Confirm Delete"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              If you proceed now order number {deleteOrderInfo.entryNo} will be
              erased. This action is irreversible.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleCloseDialog()}>Cancel</Button>
            <Button onClick={() => handleDelete()}>Proceed</Button>
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

export default Orders;
