import {
  AccountCircleRounded,
  BusinessRounded,
  LocalPhoneRounded,
} from "@mui/icons-material";
import {
  Typography,
  Stack,
  TextField,
  Button,
  InputAdornment,
  Snackbar,
  Alert,
  Box,
  Tooltip,
  Dialog,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addOrder,
  getOrderData,
  getProductData,
  getUserData,
  updateProductQuantity,
} from "../redux/apiCalls";
import QuickSearchToolbar from "../utils/QuickSearchToolbar";
import { v4 as uuidv4 } from "uuid";
import Head from "next/head";
import UserErrorPage from "./UserErrorPage";

const EntryForm = () => {
  const user = useSelector((state) => state.user.currentUser);
  const products = useSelector((state) => state.product.products);
  const productWithCommission = useSelector(
    (state) => state.product.productWithCommission
  );
  const productWithoutCommission = useSelector(
    (state) => state.product.productWithoutCommission
  );
  const [response, setResponse] = useState(false);
  const [criticalResponse, setCriticalResponse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const setUp = async () => {
      if (user.accountType === "Seller") {
        const res = await getUserData(dispatch, user.uid);
        res.type === "error" && setCriticalResponse(res);
      } else if (user.accountType === "Salesman") {
        const res = await getUserData(dispatch, user.salesmanUid);
        res.type === "error" && setCriticalResponse(res);
      }

      await getProductData(dispatch, user.uid);
      const res = await getOrderData(user.uid);
      setInputs((prev) => ({ ...prev, entryNo: res.length + 1 }));
    };
    setUp();
  }, []);

  const weekday = new Date().toLocaleString("en-us", {
    //this is so we can let only todays entry the access to remove
    weekday: "long",
  });
  const date = new Date().toLocaleString("en-us");
  const dateArray = date.split(",");

  const [inputs, setInputs] = useState({
    seller: user.uid,
    entryNo: 0, //if no entries set 1 or set first entries(sorted so) entryNo+1
    costForWithCommission: 0.0, // todays total cost for commission based product
    commissionPercentage: 0, // perchantage of discount
    commissionValue: 0.0, // discount ammount
    costAfterCommission: 0.0,
    costForWithoutCommission: 0.0, // todays total cost for without commission based product
    finalCost: 0.0, // costAfterCommission+costWithoutCommission
    previousReserve: 0.0, // previous date final reserve
    finalCost2: 0.0, //abs(previousReserve-finalCost)
    reserve: 0.0, // todays reserve
    finalReserve: 0.0, // (previousReserve-cost)+reserve
    customerName: "", //buyer
    customerContact: "", //buyer
    customerAddress: "", //buyer
  });

  //handle string value
  const handleSelectChange = (name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  //handle number values - commissionPerchantage, previousReserve, reserve
  const handleChange = (name, value) => {
    //if client forgets to put any number greater then 0 or just empty string set it auto as 0
    (isNaN(value) || value === "") &&
      setInputs((prev) => ({
        ...prev,
        [name]: 0,
      }));
    !isNaN(value) &&
      value !== "" &&
      setInputs((prev) => ({
        ...prev,
        [name]: parseFloat(value),
      }));
  };

  //set initialQuantity per product as 0
  let initialQuantity = {};
  for (let i = 0; i < products.length; i++) {
    initialQuantity[products[i]?.id] = 0;
  }
  // for product with commission
  const [quantity, setQuantity] = useState({ ...initialQuantity });
  const [subtotal, setSubtotal] = useState({ ...initialQuantity });
  // for product without commission
  const [quantity2, setQuantity2] = useState({ ...initialQuantity });
  const [subtotal2, setSubtotal2] = useState({ ...initialQuantity });

  // Handle change in quantity and also update subtotal for commission based product
  const handleQuantity = (valuePassed, price, id, stock, name) => {
    if (stock < valuePassed) {
      setValidation({
        type: "warning",
        message: `Insufficient stock for ${name}. Only ${stock} item(s) left.`,
        id: id,
      });
    } else if (valuePassed < 0) {
      setValidation({
        type: "warning",
        message: `Quantity can not contain negative value.`,
        id: id,
      });
    } else setValidation(false);

    let value = 0;
    if (valuePassed !== "" && !isNaN(valuePassed))
      value = parseInt(valuePassed);
    let subtotal = value * price;
    setSubtotal((prev) => {
      return { ...prev, [id]: subtotal.toFixed(2) };
    });
    setQuantity((prev) => {
      return { ...prev, [id]: value };
    });
  };
  // Handle change in quantity and also update subtotal for without commission based product
  const handleQuantity2 = (valuePassed, price, id, stock, name) => {
    if (stock < valuePassed) {
      setValidation({
        type: "warning",
        message: `Insufficient stock for ${name}. Only ${stock} item(s) left.`,
        id: id,
      });
    } else setValidation(false);

    let value = 0;
    if (valuePassed !== "" && !isNaN(valuePassed)) value = valuePassed;
    let subtotal = value * price;
    setSubtotal2((prev) => {
      return { ...prev, [id]: subtotal.toFixed(2) };
    });
    setQuantity2((prev) => {
      return { ...prev, [id]: value };
    });
  };

  //with change in subtotal, update total cost value for commission based product
  useEffect(() => {
    let total = 0.0;
    for (let item in subtotal) {
      total += parseFloat(subtotal[item]);
    }
    setInputs((prev) => ({ ...prev, costForWithCommission: total.toFixed(2) }));
  }, [subtotal]);

  //with change in subtotal2, update total cost value for without commission product
  useEffect(() => {
    let total = 0;
    for (let item in subtotal2) {
      total += parseFloat(subtotal2[item]);
    }
    setInputs((prev) => ({
      ...prev,
      costForWithoutCommission: total.toFixed(2),
    }));
  }, [subtotal2]);

  //with change in commission, update commission Value and cost after commission
  useEffect(() => {
    let costAfterCommission = 0.0;
    let commissionValue = 0.0;
    if (inputs.commissionPercentage !== 0)
      commissionValue =
        (inputs.commissionPercentage / 100.0) * inputs.costForWithCommission;
    costAfterCommission = inputs.costForWithCommission - commissionValue;
    setInputs((prev) => ({
      ...prev,
      commissionValue: commissionValue.toFixed(2),
    }));
    setInputs((prev) => ({
      ...prev,
      costAfterCommission: costAfterCommission.toFixed(2),
    }));
  }, [inputs.commissionPercentage, inputs.costForWithCommission]);

  //with change in costAfterCommission, costForWithoutCommission, update final cost
  useEffect(() => {
    let finalCost =
      parseFloat(inputs.costAfterCommission) +
      parseFloat(inputs.costForWithoutCommission);
    setInputs((prev) => ({ ...prev, finalCost: finalCost.toFixed(2) }));
  }, [inputs.costAfterCommission, inputs.costForWithoutCommission]);

  //with change in finalCost, previous reserve and todays reserve, update final reserve, finalCost2
  useEffect(() => {
    let finalCost2 = -parseFloat(inputs.previousReserve) - inputs.finalCost;
    let finalReserve = parseFloat(inputs.reserve) + finalCost2;
    setInputs((prev) => ({ ...prev, finalReserve: finalReserve.toFixed(2) }));
    setInputs((prev) => ({ ...prev, finalCost2: finalCost2.toFixed(2) }));
  }, [inputs.finalCost, inputs.previousReserve, inputs.reserve]);

  const columnsForProductWithCommission = [
    {
      field: "price",
      headerClassName: "super-app-theme--header",
      headerName: "Price",
      width: 100,
      editable: false,
    },
    {
      field: "name",
      headerName: "Name",
      headerClassName: "super-app-theme--header",
      width: 100,
      editable: false,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      headerClassName: "super-app-theme--header",
      width: 100,
      editable: false,
      renderCell: (params) => {
        return (
          <Stack
            sx={{
              width: 100,
              height: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Tooltip arrow title={`Available Stock: ${params.row.stock}`}>
              <TextField
                type="number"
                error={
                  params.row.stock < quantity[params.row.id] ||
                  quantity[params.row.id] < 0
                }
                disabled={
                  !params.row.stock ||
                  (validation && validation.id !== params.row.id)
                }
                fullWidth
                size="small"
                sx={{
                  backgroundColor: "#dddfff",
                }}
                placeholder="0"
                onChange={(e) =>
                  handleQuantity(
                    e.target.value,
                    params.row.price,
                    params.row.id,
                    params.row.stock,
                    params.row.name
                  )
                }
              />
            </Tooltip>
          </Stack>
        );
      },
    },
    {
      field: "subtotal",
      headerName: "Subtotal",
      headerClassName: "super-app-theme--header",
      width: 100,
      editable: false,
      renderCell: (params) => {
        return <Typography>{subtotal[params.row.id]}</Typography>;
      },
    },
  ];

  const columnsForProductWithoutCommission = [
    {
      field: "price",
      headerClassName: "super-app-theme--header",
      headerName: "Price",
      width: 100,
      editable: false,
    },
    {
      field: "name",
      headerName: "Name",
      headerClassName: "super-app-theme--header",
      width: 100,
      editable: false,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      headerClassName: "super-app-theme--header",
      width: 100,
      editable: false,
      renderCell: (params) => {
        return (
          <Stack
            sx={{
              width: 100,
              height: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Tooltip arrow title={`Available Stock: ${params.row.stock}`}>
              <TextField
                error={
                  params.row.stock < quantity[params.row.id] ||
                  quantity[params.row.id] < 0
                }
                disabled={
                  !params.row.stock ||
                  (validation && validation.id !== params.row.id)
                }
                fullWidth
                size="small"
                margin="dense"
                sx={{
                  backgroundColor: "#dddfff",
                }}
                placeholder="0"
                onChange={(e) =>
                  handleQuantity2(
                    e.target.value,
                    params.row.price,
                    params.row.id,
                    params.row.stock,
                    params.row.name
                  )
                }
              />
            </Tooltip>
          </Stack>
        );
      },
    },
    {
      field: "subtotal",
      headerName: "Subtotal",
      headerClassName: "super-app-theme--header",
      width: 100,
      editable: false,
      renderCell: (params) => {
        return <Typography>{subtotal2[params.row.id]}</Typography>;
      },
    },
  ];

  const handleOrder = async () => {
    // remove unnecessary object keys containing value 0
    Object.keys(quantity).forEach(
      (k) => quantity[k] == 0 && delete quantity[k] && delete subtotal[k]
    );
    Object.keys(quantity2).forEach(
      (k) => quantity2[k] == 0 && delete quantity2[k] && delete subtotal2[k]
    );

    if (!user.approved) {
      setResponse({
        type: "error",
        message: `You are not allowed to do that.`,
      });
    } else if (inputs.customerName === "")
      setResponse({ type: "error", message: "Please enter customer name." });
    else if (inputs.customerContact === "")
      setResponse({
        type: "error",
        message: "Please enter customer contact information.",
      });
    else if (!Object.keys(quantity).length && !Object.keys(quantity2).length) {
      setResponse({
        type: "warning",
        message:
          "You are trying to place an empty order. Order must contain at least one product.",
      });
    } else {
      setLoading(true);
      //checking if user is not banned so far
      let validUser = { type: "success" };
      if (user.accountType === "Salesman")
        validUser = await getUserData(dispatch, user.salesmanUid);

      if (validUser.type === "success") {
        const preparedBy = user.username;
        let preparedById = "";

        // if seller himself prepares the order give his uid else salesman uid
        if (user.accountType === "Seller") {
          preparedById = user.uid;
        } else {
          preparedById = user.salesmanUid;
        }

        //prepare order
        const order = {
          ...inputs,
          subtotal,
          subtotal2,
          quantity,
          quantity2,
          createdAt: new Date().toLocaleString("en-us"),
          preparedBy,
          preparedById,
          id: uuidv4(),
        };

        // place order
        try {
          // going to use Promise.all to run all these query parallely at the same time, It makes it super fast this way
          const promises = [];
          //delete order from orders docs
          promises.push(addOrder(order));
          //handle stock
          for (const key in order.quantity) {
            const p = updateProductQuantity(key, order.quantity[key], "dec");
            promises.push(p);
          }
          for (const key in order.quantity2) {
            const p = updateProductQuantity(key, order.quantity2[key], "dec");
            promises.push(p);
          }

          Promise.all(promises);

          getOrderData(user.uid).then((res) => {
            setInputs((prev) => ({ ...prev, entryNo: res.length + 1 }));
          });
          setResponse({
            type: "success",
            message: "Order placed successfully.",
          });

          setLoading(false);
        } catch (err) {
          setResponse({
            type: "error",
            message: err.message,
          });
          setLoading(false);
        }
      } else {
        setResponse({
          type: "error",
          message:
            "Dear Salesman, Your account is banned by seller. Please contact seller for any more information regarding this. Thanks",
        });
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Cash Memo - Business Tracker</title>
        <meta
          name="description"
          content="Business tracker is a web application for business people to record and to calculate their sells faster"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <>
        {user.accountType !== "Admin" && (
          <Stack>
            <Typography
              variant="h5"
              sx={{ textAlign: "center", textTransform: "capitalize" }}
            >
              {user?.shopName || <Link href="/settings">[add shop name]</Link>}
            </Typography>
            <Typography
              sx={{ textAlign: "center", textTransform: "capitalize" }}
            >
              {user?.shopAddress || (
                <Link href="/settings">[add shop address]</Link>
              )}
            </Typography>
            <Typography
              sx={{ textAlign: "center", textTransform: "capitalize" }}
            >
              {user?.shopDetails || (
                <Link href="/settings">[add shop details]</Link>
              )}
            </Typography>
            <Typography
              sx={{ textAlign: "center", textTransform: "capitalize" }}
            >
              Mobile:{" "}
              {user?.shopOtherPn || <Link href="/settings">[add phone]</Link>},
              Office:{" "}
              {user?.shopOfficePn || <Link href="/settings">[add phone]</Link>}
            </Typography>
          </Stack>
        )}
        {products.length === 0 ? (
          <Stack>
            <Typography style={{ fontSize: 20 }}>
              Please <Link href="/products/add/">add product</Link> before
              continue.
            </Typography>
          </Stack>
        ) : (
          <>
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
                  Entry: {inputs.entryNo}
                </Typography>
                <Typography sx={{ fontWeight: "bold" }}>
                  Date: {dateArray[0]}
                </Typography>
                <Typography sx={{ fontWeight: "bold" }}>
                  Day: {weekday}
                </Typography>
              </Stack>
              {/* Name Contact Address */}
              <Stack
                sx={{
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontWeight: "bold" }}>Customer</Typography>
                <Stack>
                  <TextField
                    required
                    variant="standard"
                    label="Name"
                    size="small"
                    margin="dense"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircleRounded />
                        </InputAdornment>
                      ),
                    }}
                    onChange={(e) =>
                      handleSelectChange("customerName", e.target.value)
                    }
                  />
                </Stack>
                <Stack>
                  <TextField
                    required
                    variant="standard"
                    label="Contact"
                    size="small"
                    margin="dense"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocalPhoneRounded />
                        </InputAdornment>
                      ),
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    }}
                    onChange={(e) =>
                      handleSelectChange("customerContact", e.target.value)
                    }
                  />
                </Stack>
                <Stack>
                  <TextField
                    variant="standard"
                    label="Address"
                    size="small"
                    margin="dense"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessRounded />
                        </InputAdornment>
                      ),
                    }}
                    onChange={(e) =>
                      handleSelectChange("customerAddress", e.target.value)
                    }
                  />
                </Stack>
              </Stack>
            </Stack>

            {/* Whole Calculations Part start here */}
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{
                flexDirection: { md: "column", lg: "row" },
                alignItems: { md: "center", lg: "flex-start" },
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
                          height: "50px !important",
                        },
                      }}
                    >
                      <DataGrid
                        loading={loading}
                        components={{ Toolbar: QuickSearchToolbar }}
                        rows={productWithCommission}
                        getRowId={(row) => row.id}
                        columns={columnsForProductWithCommission}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        disableSelectionOnClick
                        density="comfortable"
                        initialState={{
                          sorting: {
                            sortModel: [{ field: "createdAt", sort: "desc" }],
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
                          <Typography>
                            {inputs.costForWithCommission}৳
                          </Typography>
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
                            Commission (-)
                          </Typography>
                        </Stack>
                        <Stack
                          sx={{
                            width: 70,
                            height: 50,
                            backgroundColor: "#f1f8ff",
                          }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            margin="dense"
                            sx={{
                              backgroundColor: "#dddfff",
                            }}
                            placeholder="0"
                            onChange={(e) =>
                              handleChange(
                                "commissionPercentage",
                                e.target.value
                              )
                            }
                          />
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
                          <Typography>{inputs.commissionValue}৳</Typography>
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
                          <Typography>{inputs.costAfterCommission}৳</Typography>
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
                          height: "50px !important",
                        },
                      }}
                    >
                      <DataGrid
                        components={{ Toolbar: QuickSearchToolbar }}
                        rows={productWithoutCommission}
                        getRowId={(row) => row.id}
                        columns={columnsForProductWithoutCommission}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        disableSelectionOnClick
                        density="comfortable"
                        initialState={{
                          sorting: {
                            sortModel: [{ field: "createdAt", sort: "desc" }],
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
                        <Typography>
                          {inputs.costForWithoutCommission}৳
                        </Typography>
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
                      {inputs.costForWithoutCommission} +{" "}
                      {inputs.costAfterCommission}
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
                    <Typography>{inputs.finalCost}৳</Typography>
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
                  >
                    <TextField
                      fullWidth
                      size="small"
                      margin="dense"
                      sx={{
                        backgroundColor: "#dddfff",
                      }}
                      placeholder="0"
                      onChange={(e) =>
                        handleChange("previousReserve", e.target.value)
                      }
                    />
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
                    <Typography>{inputs.previousReserve}৳</Typography>
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
                    <Typography>{inputs.finalCost2}৳</Typography>
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
                  >
                    <TextField
                      fullWidth
                      size="small"
                      margin="dense"
                      sx={{
                        backgroundColor: "#dddfff",
                      }}
                      placeholder="0"
                      onChange={(e) => handleChange("reserve", e.target.value)}
                    />
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
                    <Typography>{inputs.reserve}৳</Typography>
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
                    <Typography>{inputs.finalReserve}৳</Typography>
                  </Stack>
                </Stack>
                <Button
                  onClick={handleOrder}
                  fullWidth
                  variant="contained"
                  disabled={loading || Boolean(validation?.id)}
                >
                  {loading ? "Loading.." : "Confirm Order"}
                </Button>
              </Stack>
            </Stack>
          </>
        )}
      </>

      {/* Display AddProduct success message or error */}
      <Snackbar
        // anchorOrigin={{ vertical: "top", horizontal: "right" }}
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

      {/* Display Quantity validation message */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={Boolean(validation)}
        onClose={() => setValidation(validation)}
      >
        <Alert
          onClose={() => setValidation(validation)}
          severity={validation?.type}
          sx={{ width: "100%" }}
        >
          {validation?.message}
        </Alert>
      </Snackbar>

      {/* In case seller or salesman is banned or erased or disapproved while still logged in */}
      <Dialog fullScreen open={Boolean(criticalResponse)} onClose={() => {}}>
        <UserErrorPage message={criticalResponse.message} />
      </Dialog>
    </>
  );
};

export default EntryForm;
