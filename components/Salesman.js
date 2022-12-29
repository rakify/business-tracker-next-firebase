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
import {
  BlockOutlined,
  BlockRounded,
  CheckCircle,
  CloseRounded,
  PersonAddAlt1,
  RecentActors,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import {
  adminUpdateUser,
  deleteUser,
  getSalesmanData,
  sellerUpdateSalesman,
} from "../redux/apiCalls";
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
  const [updateUserInfo, setUpdateUserInfo] = useState(false);
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

  const handleUpdate = () => {
    if (user.accountType !== "Seller" || !user.approved) {
      setResponse({
        type: "error",
        message: `You are not allowed to do that.`,
      });
    } else {
      setLoading(true);
      const updatedUser = {
        ...updateUserInfo,
        approved: !updateUserInfo.approved,
      };
      sellerUpdateSalesman(updatedUser).then((res) => {
        setResponse(res);
        getSalesmanData(user.uid).then((res) => {
          if (res.status === 200) {
            setSalesman(res.data);
            setLoading(false);
            setUpdateUserInfo(false);
          }
        });
      });
    }
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
      renderCell: (params) => {
        return new Date(params.row.createdAt.seconds * 1000).toLocaleString(
          "en-us"
        );
      },
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
      field: "action",
      headerName: "Action",
      headerClassName: "super-app-theme--header",
      width: 150,
      renderCell: (params) => {
        return (
          <Stack direction="row" alignItems="center" sx={{ gap: 2 }}>
            {params.row.approved ? (
              <IconButton
                aria-label="disapprove"
                onClick={() => setUpdateUserInfo(params.row)}
              >
                <Tooltip arrow title="Ban Salesman">
                  <BlockOutlined />
                </Tooltip>
              </IconButton>
            ) : (
              <IconButton
                aria-label="approve"
                onClick={() => setUpdateUserInfo(params.row)}
              >
                <Tooltip arrow title="Approve Salesman">
                  <CheckCircle />
                </Tooltip>
              </IconButton>
            )}
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
          <Stack direction="row" gap={1} fontWeight="bolder">
            <RecentActors /> Your Salesmen
          </Stack>
          <Tooltip title="Appoint Salesman" arrow>
            <Button
              onClick={() => setAddNew(true)}
              variant="contained"
              sx={{ color: "white" }}
            >
              <PersonAddAlt1 />
            </Button>
          </Tooltip>
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
          <p style={{ color: "red", textAlign: "center" }}>Reminder: </p>{" "}
          <p style={{ textAlign: "center" }}>
            All a salesman can do is reset salesman's password with the provided
            email associated with salesman account, place order and delete salesman's
            order.
          </p>
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
          open={Boolean(updateUserInfo)}
          TransitionComponent={SlideTransition}
          keepMounted
          onClose={() => setUpdateUserInfo(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Confirm Delete"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              If you proceed now salesman with ID {updateUserInfo.uid} will be
              banned temporarily. You can reverse this change anytime.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUpdateUserInfo(false)}>Cancel</Button>
            <Button disable={loading} onClick={() => handleUpdate()}>
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
