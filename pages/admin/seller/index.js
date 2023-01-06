import {
  BlockOutlined,
  CheckCircle,
  DeleteOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Slide,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { forwardRef, useEffect, useState } from "react";
import {
  adminUpdateUser,
  deleteUser,
  getAllUsers,
} from "../../../redux/apiCalls";
import QuickSearchToolbar from "../../../utils/QuickSearchToolbar";

const SlideTransition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SellerList = () => {
  const [sellers, setSellers] = useState([]);
  const [deleteUserUid, setDeleteUserUid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(false);
  const [updateUserInfo, setUpdateUserInfo] = useState(false);
  useEffect(() => {
    setLoading(true);
    getAllUsers().then((res) => {
      setSellers(res);
      setLoading(false);
    });
  }, []);

  const handleDelete = () => {
    setLoading(true);
    deleteUser(deleteUserUid).then((res) => {
      setResponse(res);
      setDeleteUserUid(false);
      getAllUsers.then((res) => {
        setSellers(res);
        setLoading(false);
      });
    });
  };

  const handleUpdate = () => {
    setLoading(true);
    const updatedUser = {
      ...updateUserInfo,
      approved: !updateUserInfo.approved,
    };
    adminUpdateUser(updatedUser).then((res) => {
      setResponse(res);
      getAllUsers().then((res) => {
        setSellers(res);
        setLoading(false);
        setUpdateUserInfo(false);
      });
    });
  };

  const columns = [
    {
      field: "createdAt",
      headerName: "Created At",
      headerClassName: "super-app-theme--header",
      width: 200,
      editable: false,
      renderCell: (params) => {
        return new Date(params.row.createdAt.seconds * 1000).toLocaleString(
          "en-us"
        );
      },
    },
    {
      field: "approved",
      headerClassName: "super-app-theme--header",
      headerName: "Status",
      width: 100,
      editable: false,
      renderCell: (params) => {
        return params.row.approved ? "Approved" : "Awaiting";
      },
    },
    {
      field: "uid",
      headerName: "UID",
      headerClassName: "super-app-theme--header",
      width: 250,
      editable: false,
    },
    {
      field: "email",
      headerName: "Email",
      headerClassName: "super-app-theme--header",
      width: 150,
      editable: false,
    },
    {
      field: "phoneNumber",
      headerName: "Phone",
      headerClassName: "super-app-theme--header",
      width: 150,
      editable: false,
    },
    {
      field: "shopName",
      headerName: "Shop Name",
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
              onClick={() => setDeleteUserUid(params.row.uid)}
            >
              <Tooltip arrow title="Erase User">
                <DeleteOutlined />
              </Tooltip>
            </IconButton>
            {params.row.approved ? (
              <IconButton
                aria-label="disapprove"
                onClick={() => setUpdateUserInfo(params.row)}
              >
                <Tooltip arrow title="Ban User">
                  <BlockOutlined />
                </Tooltip>
              </IconButton>
            ) : (
              <IconButton
                aria-label="approve"
                onClick={() => setUpdateUserInfo(params.row)}
              >
                <Tooltip arrow title="Approve User">
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
          <Typography>All Registered Sellers</Typography>
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
            rows={sellers}
            getRowId={(row) => row.uid}
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

        {/* Confirm Update Dialog */}
        <Dialog
          open={Boolean(updateUserInfo)}
          TransitionComponent={SlideTransition}
          keepMounted
          onClose={() => setUpdateUserInfo(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Confirm Update"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              If you proceed now seller with UID {updateUserInfo.uid} will be{" "}
              {updateUserInfo.approved ? "Banned" : "Approved"}.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button disabled={loading} onClick={() => setUpdateUserInfo(false)}>
              Cancel
            </Button>
            <Button disabled={loading} onClick={() => handleUpdate()}>
              {loading ? "Loading.." : "Proceed"}
            </Button>
          </DialogActions>
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
              If you proceed now seller with UID {deleteUserUid} will be erased.
              This action is irreversible.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteUserUid(false)}>Cancel</Button>
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

export default SellerList;
