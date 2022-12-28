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
  Collapse,
} from "@mui/material";
import { useSelector } from "react-redux";
import { BlockRounded, CloseRounded } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { deleteUser, getSalesmanData } from "../redux/apiCalls";
import QuickSearchToolbar from "../utils/QuickSearchToolbar";
import AddSalesman from "./AddSalesman";

const CollapseTransition = forwardRef(function Transition(props, ref) {
  return <Collapse ref={ref} {...props} />;
});
const SlideTransition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Salesman = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [salesman, setSalesman] = useState([]);
  const [deleteUserUid, setDeleteUserUid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addNew, setAddNew] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSalesmanData(user.uid).then((res) => {
      res.status === 200 && setSalesman(res.data);
      setLoading(false);
    });
  }, []);

  const [response, setResponse] = useState(false);

  const handleDelete = () => {
    setLoading(true);
    setDeleteUserUid(false);
    deleteUser(deleteUserUid).then((res) => {
      setResponse(res);
      setLoading(false);
      getSalesmanData(user.uid).then((res) => {
        res.status === 200 && setSalesman(res.data);
      });
    });
  };

  // when add new salesman successful AddSalesman will return to this with response
  const handleCloseDialog = (res) => {
    setAddNew(false);
    getSalesmanData(user.uid).then((res) => {
      res.status === 200 && setSalesman(res.data);
    });
    setResponse(res);
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
      field: "username",
      headerName: "Userame",
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
          sx={{ p: 1, backgroundColor: "#8af", color: "white" }}
        >
          <Typography>Your Salesmen</Typography>
          <Button
            onClick={() => setAddNew(true)}
            variant="outlined"
            sx={{ color: "white" }}
          >
            Appoint
          </Button>
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
              noRowsLabel: "No salesman has been appointed yet.",
            }}
            loading={loading}
            components={{ Toolbar: QuickSearchToolbar }}
            rows={salesman}
            getRowId={(row) => row.salesmanUid}
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

        <Typography>
          <b style={{ color: "red" }}>Reminder: </b>{" "}
          <marquee behavior="scroll" direction="left" scrollamount="7">
            All a salesman can do is reset his/her password with the provided
            email associated with salesman account, place order and delete his
            order.
          </marquee>
        </Typography>

        {/* Add New Salesman Dialog */}
        <Dialog
          sx={{ overflowX: "scroll" }}
          open={Boolean(addNew)}
          TransitionComponent={CollapseTransition}
          onClose={() => setAddNew(false)}
          aria-describedby="Add New Saleman"
        >
          <DialogTitle>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ p: 1, backgroundColor: "#83cee0", color: "white" }}
            >
              <Typography>Appoint Salesman</Typography>
              <Button size="small" onClick={() => setAddNew(false)}>
                <Tooltip title="Go back">
                  <CloseRounded />
                </Tooltip>
              </Button>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <AddSalesman handleCloseDialog={handleCloseDialog} />
          </DialogContent>
        </Dialog>

        {/* Confirm Delete Dialog */}
        <Dialog
          open={Boolean(deleteUserUid)}
          TransitionComponent={SlideTransition}
          keepMounted
          onClose={() => setDeleteUserUid(false)}
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
            <Button onClick={() => setDeleteUserUid(false)}>Cancel</Button>
            <Button
              disable={loading}
              onClick={() => handleDelete(deleteUserUid)}
            >
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
    </>
  );
};

export default Salesman;
