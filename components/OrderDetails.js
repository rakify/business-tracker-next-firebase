import { Close } from "@mui/icons-material";
import { Box, Container, IconButton, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { useSelector } from "react-redux";
import QuickSearchToolbar from "../utils/QuickSearchToolbar";

const OrderDetails = ({ handleClose, order }) => {
  const user = useSelector((state) => state.user.currentUser);
  const products = useSelector((state) => state.product.products);

  const productWithCommission = useSelector(
    (state) => state.product.productWithCommission
  );
  const productWithoutCommission = useSelector(
    (state) => state.product.productWithoutCommission
  );

  const date = new Date(order.createdAt.seconds * 1000).toLocaleString("en-us");
  const dateArray = date.split(",");
  const weekday = new Date(order.createdAt.seconds * 1000).toLocaleString(
    "en-us",
    {
      weekday: "long",
    }
  );

  const columnsForProductWithCommission = [
    {
      field: "price",
      headerClassName: "super-app-theme--header",
      headerName: "Price",
      width: 80,
      editable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "name",
      headerName: "Name",
      headerClassName: "super-app-theme--header",
      width: 155,
      editable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      headerClassName: "super-app-theme--header",
      width: 100,
      editable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return <Typography>{order.quantity[params.row.id] || 0}</Typography>;
      },
    },
    {
      field: "subtotal",
      headerName: "Subtotal",
      headerClassName: "super-app-theme--header",
      width: 80,
      editable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return <Typography>{order.subtotal[params.row.id] || 0}</Typography>;
      },
    },
  ];

  const columnsForProductWithoutCommission = [
    {
      field: "price",
      headerClassName: "super-app-theme--header",
      headerName: "Price",
      width: 80,
      editable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "name",
      headerName: "Name",
      headerClassName: "super-app-theme--header",
      width: 155,
      editable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      headerClassName: "super-app-theme--header",
      width: 100,
      editable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return <Typography>{order.quantity2[params.row.id] || 0}</Typography>;
      },
    },
    {
      field: "subtotal",
      headerName: "Subtotal",
      headerClassName: "super-app-theme--header",
      width: 80,
      editable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return <Typography>{order.subtotal2[params.row.id] || 0}</Typography>;
      },
    },
  ];

  return (
    <>
      <Container>
        <Stack direction="row" justifyContent="space-between">
          <IconButton size="small" onClick={handleClose}>
            <Close fontSize="small" />
          </IconButton>
        </Stack>

        {/* Front part */}
        <Stack>
          <Typography
            variant="h5"
            sx={{ textAlign: "center", textTransform: "capitalize" }}
          >
            {user?.shopName}
          </Typography>
          <Typography sx={{ textAlign: "center", textTransform: "capitalize" }}>
            {user?.shopAddress}
          </Typography>
          <Typography sx={{ textAlign: "center", textTransform: "capitalize" }}>
            {user?.shopDetails}
          </Typography>
          <Typography sx={{ textAlign: "center", textTransform: "capitalize" }}>
            Mobile: {user?.shopOtherPn}, Office: {user?.shopOfficePn}
          </Typography>
        </Stack>

        {/* entry no date Customer name */}
        <Stack sx={{ marginLeft: 5, marginRight: 5, marginBottom: 5 }}>
          {/* Entry Date Day */}
          <Stack
            sx={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              Entry: {order.entryNo}
            </Typography>
            <Typography sx={{ fontWeight: "bold" }}>
              Date: {dateArray[0]}
            </Typography>
            <Typography sx={{ fontWeight: "bold" }}>Day: {weekday}</Typography>
          </Stack>

          {/* Name Contact Address */}
          <Stack
            sx={{
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              Name: {order.customerName}
            </Typography>
            <Typography sx={{ fontWeight: "bold" }}>
              Contact: {order.customerContact}
            </Typography>
            <Typography sx={{ fontWeight: "bold" }}>
              Address: {order.customerAddress}
            </Typography>
          </Stack>
        </Stack>

        {/* Whole Calculations Part start here */}
        <Stack
          justifyContent="space-between"
          sx={{
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "center", md: "flex-start" },
            gap: 5,
          }}
        >
          {/* There exists product with commission */}
          <Stack>
            {productWithoutCommission.length !== products.length && (
              <>
                <Typography
                  variant="overline"
                  sx={{
                    borderLeftWidth: 1,
                    borderColor: "#2263a5",
                    textAlign: "center",
                    fontSize: 10,
                    color: "white",
                    backgroundColor: "#2263a5",
                  }}
                >
                  Products That Accept Commission
                </Typography>
                <Box
                  sx={{
                    height: 500,
                    width: 420,
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
                    rows={productWithCommission}
                    getRowId={(row) => row.id}
                    columns={columnsForProductWithCommission}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    disableSelectionOnClick
                    density="comfortable"
                    initialState={{
                      sorting: {
                        sortModel: [{ field: "name", sort: "asc" }],
                      },
                    }}
                  />
                </Box>

                {/* Calculations Part For Product that accepts commission */}
                <>
                  <Stack
                    sx={{
                      flexDirection: "row",
                      borderBottomWidth: 1,
                      borderColor: "#7393b3",
                    }}
                  >
                    <Typography
                      sx={{
                        width: 70,
                        height: 50,
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    ></Typography>
                    <Stack
                      sx={{
                        width: 160,
                        height: 50,
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          width: "100%",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textAlign: "center",
                        }}
                      >
                        Total
                      </Typography>
                    </Stack>
                    <Typography
                      sx={{
                        width: 70,
                        height: 50,
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    ></Typography>
                    <Stack
                      sx={{
                        width: 70,
                        height: 50,
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <Typography>{order.costForWithCommission}৳</Typography>
                    </Stack>
                  </Stack>

                  <Stack
                    sx={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      borderBottomWidth: 1,
                      borderColor: "#7393b3",
                    }}
                  >
                    <Stack
                      sx={{
                        width: 70,
                        height: 50,
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    ></Stack>
                    <Stack
                      sx={{
                        width: 160,
                        height: 50,
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          width: "100%",
                        }}
                      >
                        Commission (-) {order.commissionPercentage}%
                      </Typography>
                    </Stack>
                    <Stack
                      sx={{
                        width: 70,
                        height: 50,
                        backgroundColor: "#f1f8ff",
                      }}
                    ></Stack>
                    <Stack
                      sx={{
                        width: 70,
                        height: 50,
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <Typography>{order.commissionValue}৳</Typography>
                    </Stack>
                  </Stack>
                  <Stack
                    sx={{
                      flexDirection: "row",
                      borderBottomWidth: 1,
                      borderColor: "#7393b3",
                    }}
                  >
                    <Stack
                      sx={{
                        width: 70,
                        height: 50,
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    ></Stack>
                    <Stack
                      sx={{
                        width: 160,
                        height: 50,
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    ></Stack>
                    <Stack
                      sx={{
                        width: 70,
                        height: 50,
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <Typography>=</Typography>
                    </Stack>
                    <Stack
                      sx={{
                        width: 70,
                        height: 50,
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <Typography>{order.costAfterCommission}৳</Typography>
                    </Stack>
                  </Stack>
                </>
              </>
            )}
          </Stack>
          {/* Product That Dont Accept Commission */}
          <Stack>
            {productWithoutCommission.length !== 0 && (
              <>
                <Typography
                  variant="overline"
                  sx={{
                    borderLeftWidth: 1,
                    borderColor: "#2263a5",
                    textAlign: "center",
                    fontSize: 10,
                    color: "white",
                    backgroundColor: "#2263a5",
                  }}
                >
                  Products That Don't Accept Commission
                </Typography>

                {/* Product list that does not accept Commission */}
                <Box
                  sx={{
                    height: 500,
                    width: 420,
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
                    rows={productWithoutCommission}
                    getRowId={(row) => row.id}
                    columns={columnsForProductWithoutCommission}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    disableSelectionOnClick
                    density="comfortable"
                    initialState={{
                      sorting: {
                        sortModel: [{ field: "name", sort: "asc" }],
                      },
                    }}
                  />
                </Box>

                {/* Result of Product that doesnt accept commission */}
                <Stack
                  sx={{
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    borderColor: "#7393b3",
                  }}
                >
                  <Stack
                    sx={{
                      width: 70,
                      height: 50,
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  ></Stack>
                  <Stack
                    sx={{
                      width: 160,
                      height: 50,
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  ></Stack>
                  <Stack
                    sx={{
                      width: 70,
                      height: 50,
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Typography>=</Typography>
                  </Stack>
                  <Stack
                    sx={{
                      width: 70,
                      height: 50,
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Typography>{order.costForWithoutCommission}৳</Typography>
                  </Stack>
                </Stack>
              </>
            )}
          </Stack>

          {/* FInal Calculations Part */}
          <Stack
            alignItems="center"
            sx={{
              backgroundColor: "#f1f8ff",
            }}
          >
            <Typography
              variant="overline"
              sx={{
                borderBottom: "1px solid #2263a5",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Final Result
            </Typography>

            <Stack direction="row" sx={{ backgroundColor: "" }}>
              <Typography
                sx={{
                  width: 70,
                  height: 50,
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  textAlign: "center",
                }}
              ></Typography>
              <Stack
                sx={{
                  width: 160,
                  height: 50,
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    width: "100%",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textAlign: "center",
                  }}
                >
                  {order.costForWithoutCommission} + {order.costAfterCommission}
                </Typography>
              </Stack>
              <Typography
                sx={{
                  width: 70,
                  height: 50,
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  textAlign: "center",
                }}
              ></Typography>
              <Stack
                sx={{
                  width: 70,
                  height: 50,
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Typography>{order.finalCost}৳</Typography>
              </Stack>
            </Stack>

            <Stack
              sx={{
                flexDirection: "row",
                borderBottomWidth: 1,
                borderColor: "#7393b3",
              }}
            >
              <Stack
                sx={{
                  width: 70,
                  height: 50,
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  textAlign: "center",
                }}
              ></Stack>
              <Stack
                sx={{
                  width: 160,
                  height: 50,
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    width: "100%",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textAlign: "center",
                  }}
                >
                  Previous Due
                </Typography>
              </Stack>
              <Stack
                sx={{
                  width: 70,
                  height: 50,
                  backgroundColor: "#f1f8ff",
                }}
              ></Stack>
              <Stack
                sx={{
                  width: 70,
                  height: 50,
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Typography>{order.previousReserve}৳</Typography>
              </Stack>
            </Stack>

            <Stack
              sx={{
                flexDirection: "row",
                borderBottomWidth: 1,
                borderColor: "#7393b3",
              }}
            >
              <Stack
                sx={{
                  width: 70,
                  height: 50,
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  textAlign: "center",
                }}
              ></Stack>
              <Stack
                sx={{
                  width: 160,
                  height: 50,
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  textAlign: "center",
                }}
              ></Stack>
              <Stack
                sx={{
                  width: 70,
                  height: 50,
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  textAlign: "center",
                }}
              ></Stack>
              <Stack
                sx={{
                  width: 70,
                  height: 50,
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Typography>{order.finalCost2}৳</Typography>
              </Stack>
            </Stack>

            <Stack
              sx={{
                flexDirection: "row",
                borderBottomWidth: 1,
                borderColor: "#7393b3",
              }}
            >
              <Stack
                sx={{
                  width: 70,
                  height: 50,
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  textAlign: "center",
                }}
              ></Stack>
              <Stack
                sx={{
                  width: 160,
                  height: 50,
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    width: "100%",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textAlign: "center",
                  }}
                >
                  Reserve Today
                </Typography>
              </Stack>
              <Stack
                sx={{
                  width: 70,
                  height: 50,
                  backgroundColor: "#f1f8ff",
                }}
              ></Stack>
              <Stack
                sx={{
                  width: 70,
                  height: 50,
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Typography>{order.reserve}৳</Typography>
              </Stack>
            </Stack>

            <Stack
              sx={{
                flexDirection: "row",
                borderBottomWidth: 1,
                borderColor: "#7393b3",
              }}
            >
              <Typography
                sx={{
                  width: 70,
                  height: 50,
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  textAlign: "center",
                }}
              ></Typography>
              <Stack
                sx={{
                  width: 160,
                  height: 50,
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    width: "100%",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textAlign: "center",
                  }}
                >
                  Total Due
                </Typography>
              </Stack>
              <Typography
                sx={{
                  width: 70,
                  height: 50,
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  textAlign: "center",
                }}
              ></Typography>
              <Stack
                sx={{
                  width: 70,
                  height: 50,
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Typography>{order.finalReserve}৳</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </>
  );
};

export default OrderDetails;
