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
  BlockRounded,
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
import {
  deleteProduct,
  deleteUser,
  getOrderData,
  getProductData,
  getSalesmanData,
} from "../redux/apiCalls";
import QuickSearchToolbar from "../utils/QuickSearchToolbar";

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
const Salesman = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [salesman, setSalesman] = useState([]);
  const [deleteUserUid, setDeleteUserUid] = useState(false);

  useEffect(() => {
    getSalesmanData(user.uid).then((res) => {
      console.log(res);
      res.status === 200 && setSalesman(res.data);
    });
  }, []);

  console.log(Salesman);
  const [response, setResponse] = useState(false);

  const handleDelete = () => {
    setDeleteUserUid(false);
    deleteUser(deleteUserUid).then((res) => {
      setResponse(res);
      res.type === "success" &&
        getSalesmanData(user.uid).then((res) => {
          console.log(res);
          res.status === 200 && setSalesman(res.data);
        });
    });
  };

  const handleCloseDialog = () => {
    setDeleteUserUid(false);
  };

  const columns = [
    {
      field: "createdAt",
      headerName: "Created At",
      headerClassName: "super-app-theme--header",
      width: 250,
      editable: false,
    },
    {
      field: "name",
      headerName: "Name",
      headerClassName: "super-app-theme--header",
      width: 150,
      editable: false,
    },
    {
      field: "email",
      headerName: "Email",
      headerClassName: "super-app-theme--header",
      width: 200,
      editable: false,
    },
    {
      field: "phoneNumber",
      headerName: "Phone",
      headerClassName: "super-app-theme--header",
      width: 200,
      editable: false,
    },
    {
      field: "lastLoginAt",
      headerName: "Last Login",
      headerClassName: "super-app-theme--header",
      width: 250,
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
              onClick={() => setDeleteUserUid(params.row.salesmanUid)}
            >
              <Tooltip title="Disable Salesman">
                <BlockRounded sx={{ color: "red" }} />
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
          <Typography>Your Salesmen</Typography>
          <Link href="/salesman/add/">
            <Tooltip title="Add Salesman">
              <AddCircle fontSize="large" />
            </Tooltip>
          </Link>
        </Stack>

        {salesman.length === 0 ? (
          <Typography
            sx={{
              color: "red",
              fontSize: 20,
              backgroundColor: "whitesmoke",
              padding: 20,
            }}
          >
            No salesman added yet.
          </Typography>
        ) : (
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
              components={{ Toolbar: QuickSearchToolbar }}
              rows={salesman}
              getRowId={(row) => row.salesmanUid}
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
        )}

        {/* Confirm Delete */}
        <Dialog
          open={Boolean(deleteUserUid)}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseDialog}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Confirm Delete"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              If you proceed now salesman with ID {deleteUserUid} will be
              erased. This action is irreversible.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button>Cancel</Button>
            <Button onClick={() => handleDelete(deleteUserUid)}>Proceed</Button>
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

export default Salesman;
