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
  Search,
} from "@mui/icons-material";
import Link from "next/link";
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { deleteProduct, getOrderData, getProductData } from "../redux/apiCalls";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function QuickToolbar(props) {
  return (
    <div>
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
    </div>
  );
}
const Orders = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrderData(user.uid).then((res) => {
      setOrders(res);
    });
  }, []);

  const [deleteOrderId, setDeleteOrderId] = useState(false);
  const [response, setResponse] = useState(false);

  const handleDelete = () => {
    setDeleteOrderId(false);
    // deleteOrder(dispatch, deleteOrderId).then((res) => {
    //   res.type === "success" && getOrderData(dispatch, user.uid);
    //   setResponse(res);
    // });
  };

  // const handleCloseDialog = () => {
  //   setDeleteProductId(false);
  // };

  const columns = [
    {
      field: "entryNo",
      headerClassName: "super-app-theme--header",
      headerName: "Entry No",
      width: 200,
      editable: true,
    },
    {
      field: "customerName",
      headerName: "Customer",
      headerClassName: "super-app-theme--header",
      width: 150,
      editable: true,
    },
    {
      field: "customerContact",
      headerName: "Contact",
      headerClassName: "super-app-theme--header",
      width: 150,
      editable: true,
    },
    {
      field: "finalReserve",
      headerName: "Final Reserve",
      headerClassName: "super-app-theme--header",
      width: 150,
      editable: true,
    },
    {
      field: "preparedBy",
      headerName: "Prepared By",
      headerClassName: "super-app-theme--header",
      width: 150,
      editable: true,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      headerClassName: "super-app-theme--header",
      width: 250,
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
              // onClick={() => setDeleteProductId(params.row.id)}
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
          <Typography>List of Orders</Typography>
        </Stack>

        {orders && orders.length === 0 ? (
          <Typography
            sx={{
              color: "red",
              fontSize: 20,
              backgroundColor: "whitesmoke",
              padding: 20,
            }}
          >
            No order added yet.
          </Typography>
        ) : (
          <DataGrid
            loading={orders.length === 0}
            components={{ Toolbar: QuickToolbar }}
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
        )}

        {/* Confirm Delete */}
        <Dialog
          open={Boolean(false)}
          TransitionComponent={Transition}
          keepMounted
          // onClose={handleCloseDialog}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Confirm Delete"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              If you proceed now product with ID 1 will be erased. This action
              is irreversible.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button>Cancel</Button>
            <Button onClick={() => handleDelete(1)}>Proceed</Button>
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
