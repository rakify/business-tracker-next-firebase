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
  Tooltip,
  Snackbar,
  Alert,
  Slide,
  DialogContentText,
  DialogActions,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { DeleteOutlined, InfoOutlined, ReceiptLong } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import {
  deleteOrder,
  getOrderData,
  getUserData,
  updateProductQuantity,
} from "../redux/apiCalls";
import QuickSearchToolbar from "../utils/QuickSearchToolbar";
import UserErrorPage from "./UserErrorPage";
import SwipeableEdgeDrawer from "../utils/Drawer";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Orders = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteOrderInfo, setDeleteOrderInfo] = useState(false);
  const [response, setResponse] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const setUp = async () => {
      setLoading(true);
      if (user.accountType === "Seller") {
        await getUserData(dispatch, user.uid);
      } else if (user.accountType === "Salesman") {
        await getUserData(dispatch, user.salesmanUid);
      }
      const res = await getOrderData(user.uid);
      setOrders(res);
      setLoading(false);
    };
    setUp();
  }, []);

  const handleDelete = async () => {
    if (
      user.accountType === "Salesman" &&
      (!user.approved || deleteOrderInfo.preparedBy !== user.username)
    ) {
      setResponse({
        type: "error",
        message: `You are not allowed to do that.`,
      });
      setDeleteOrderInfo(false);
    } else {
      setLoading(true);
      try {
        // going to use Promise.all to run all these query parallely at the same time, It makes it super fast this way
        const promises = [];
        //delete order from orders docs
        promises.push(deleteOrder(deleteOrderInfo.id));
        //handle stock
        for (const key in deleteOrderInfo.quantity) {
          const p = updateProductQuantity(
            key,
            deleteOrderInfo.quantity[key],
            "inc"
          );
          promises.push(p);
        }
        for (const key in deleteOrderInfo.quantity2) {
          const p = updateProductQuantity(
            key,
            deleteOrderInfo.quantity2[key],
            "inc"
          );
          promises.push(p);
        }

        await Promise.all(promises);

        const newOrders = await getOrderData(user.uid);
        setOrders(newOrders);

        setResponse({
          type: "success",
          message: "Order deleted successfully.",
        });
        setDeleteOrderInfo(false);
        setLoading(false);
      } catch (err) {
        setDeleteOrderInfo(false);
        setResponse({
          type: "error",
          message: err.message,
        });
        setLoading(false);
      }
    }
  };

  const handleCloseDialog = () => {
    setDeleteOrderInfo(false);
  };

  const handleCloseOpenDetails = ()=>{
    setOpenDetails(!openDetails);
  }

  const columns = [
    {
      field: "createdAt",
      headerName: "Created At",
      headerClassName: "super-app-theme--header",
      width: 180,
      editable: false,
      renderCell: (params) => {
        return new Date(params.row.createdAt.seconds * 1000).toLocaleString(
          "en-us"
        );
      },
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
      width: 120,
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
      width: 120,
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
            <IconButton
              aria-label="details"
              onClick={() => setOpenDetails(params.row)}
            >
              <Tooltip title="Details">
                <InfoOutlined />
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
        maxWidth="md"
        sx={{ backgroundColor: "whitesmoke", mt: 1 }}
        disableGutters
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 1, backgroundColor: "#8af", color: "white" }}
        >
          <Stack direction="row" gap={1} fontWeight="bolder">
            <ReceiptLong /> List of Orders
          </Stack>
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
            <Button disabled={loading} onClick={() => handleCloseDialog()}>
              Cancel
            </Button>
            <Button disabled={loading} onClick={() => handleDelete()}>
              {loading ? "Loading.." : "Proceed"}
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

      {openDetails && (
        <SwipeableEdgeDrawer handleClose={handleCloseOpenDetails} order={openDetails} />
      )}
    </>
  );
};

export default Orders;
