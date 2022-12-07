import { Container, Typography, Stack, TextField, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductData } from "../redux/apiCalls";
const EntryForm = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const products = useSelector((state) => state.product.products);

  useEffect(() => {
    getProductData(dispatch, user.uid);
  }, [user.uid]);

  const weekday = new Date().toLocaleString("en-us", {
    //this is so we can let only todays entry the access to remove
    weekday: "long",
  });
  const date = new Date().toLocaleString("en-us");
  const dateArray = date.split(",");

  const [inputs, setInputs] = useState({
    user: user.username,
    entryNo: 1, //if no entries set 1 or set first entries(sorted so) entryNo+1
    date: date,
    costForWithCommission: 0.0, // todays total cost for commission based product
    commissionPercentage: 0.0, // perchantage of discount
    commissionValue: 0.0, // discount ammount
    costAfterCommission: 0.0,
    costForWithoutCommission: 0.0, // todays total cost for without commission based product
    finalCost: 0.0, // costAfterCommission+costWithoutCommission
    previousReserve: 0.0, // previous date final reserve
    finalCost2: 0.0, //abs(previousReserve-finalCost)
    reserve: 0.0, // todays reserve
    finalReserve: 0.0, // (previousReserve-cost)+reserve
    by: "", //buyer
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
  const handleQuantity = (valuePassed, price, id) => {
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
  const handleQuantity2 = (valuePassed, price, id) => {
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

  let productWithoutCommission = [];
  if (products)
    productWithoutCommission = products?.filter(
      (item) => item?.acceptCommission !== true
    );

  const handleOrder = () => {
    //if theres quantity more than 0 update products stock

    //place order
    const order = {
      ...inputs,
      subtotal,
      subtotal2,
      quantity,
      quantity2,
    };
    console.log(order);
  };

  return (
    <>
      <Container>
        <Stack>
          <Typography
            variant="h5"
            sx={{ textAlign: "center", textTransform: "capitalize" }}
          >
            {user?.shopName || ""}
          </Typography>
          <Typography sx={{ textAlign: "center", textTransform: "capitalize" }}>
            {user?.shopAddress || ""}
          </Typography>
          <Typography sx={{ textAlign: "center", textTransform: "capitalize" }}>
            {user?.shopDetails || ""}
          </Typography>
          <Typography sx={{ textAlign: "center", textTransform: "capitalize" }}>
            Mobile: {user?.shopOtherPn || ""}, Office:{" "}
            {user?.shopOfficePn || ""}
          </Typography>
        </Stack>
        {products === 0 ? (
          <Stack>
            <Typography style={{ fontSize: 20 }}>
              Please add products before continue.
            </Typography>
          </Stack>
        ) : (
          <>
            <Stack sx={{ marginLeft: 5, marginRight: 5, marginBottom: 5 }}>
              <Stack
                sx={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontWeight: "bold" }}>Entry: 1</Typography>
                <Typography sx={{ fontWeight: "bold" }}>
                  Date: {dateArray[0]}
                </Typography>
                <Typography sx={{ fontWeight: "bold" }}>
                  Day: {weekday}
                </Typography>
              </Stack>
              <Stack
                sx={{
                  flexDirection: "row",
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontWeight: "bold" }}>Name:</Typography>
                <TextField
                  variant="filled"
                  size="small"
                  margin="dense"
                  sx={{
                    backgroundColor: "#dddfff",
                    textAlign: "center",
                  }}
                  onChange={(e) => handleSelectChange("by", e.target.value)}
                />
              </Stack>
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ flexDirection: { xs: "column", md: "row" }, gap: 5 }}
            >
              {/* There exists product with commission */}
              <Stack>
                {productWithoutCommission.length !== products.length && (
                  <>
                    <Typography
                      variant="overline"
                      sx={{
                        border: "1px solid #2263a5",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 10,
                      }}
                    >
                      Products That Accept Commission
                    </Typography>
                    <Stack>
                      <Stack
                        sx={{
                          flexDirection: "row",
                          borderBottomWidth: 1,
                          borderColor: "black",
                        }}
                      >
                        <Stack
                          sx={{
                            width: 70,
                            height: 50,
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            backgroundColor: "#2263a5",
                            borderLeftWidth: 1,
                            borderColor: "#f1f8ff",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "white",
                              fontWeight: "bold",
                              fontSize: 10,
                            }}
                          >
                            Price
                          </Typography>
                        </Stack>
                        <Stack
                          sx={{
                            width: 160,
                            height: 50,
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            backgroundColor: "#2263a5",
                            borderLeftWidth: 1,
                            borderColor: "#f1f8ff",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "white",
                              fontWeight: "bold",
                              fontSize: 10,
                            }}
                          >
                            Name
                          </Typography>
                        </Stack>
                        <Stack
                          sx={{
                            width: 70,
                            height: 50,
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            backgroundColor: "#2263a5",
                            borderLeftWidth: 1,
                            borderColor: "#f1f8ff",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "white",
                              fontWeight: "bold",
                              fontSize: 10,
                            }}
                          >
                            Quantity
                          </Typography>
                        </Stack>
                        <Stack
                          sx={{
                            width: 70,
                            height: 50,
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            backgroundColor: "#2263a5",
                            borderLeftWidth: 1,
                            borderColor: "#f1f8ff",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "white",
                              fontWeight: "bold",
                              fontSize: 10,
                            }}
                          >
                            Subtotal
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>

                    {products
                      .filter((item) => item?.acceptCommission === true)
                      .map((item) => (
                        <Stack key={item?.id}>
                          <Stack
                            sx={{
                              flexDirection: "row",
                            }}
                          >
                            <Stack
                              sx={{
                                width: 70,
                                height: 50,
                                justifyContent: "space-evenly",
                                alignItems: "center",
                                backgroundColor: "#f1f8ff",
                              }}
                            >
                              <Typography style={{ color: "red" }}>
                                {item?.price}
                              </Typography>
                            </Stack>
                            <Stack
                              sx={{
                                borderLeftWidth: 1,
                                borderColor: "#ffffff",
                                width: 160,
                                height: 50,
                                justifyContent: "space-evenly",
                                alignItems: "center",
                                backgroundColor: "#f1f8ff",
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
                                {item?.name}
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
                                f
                                placeholder="0"
                                onChange={(e) =>
                                  handleQuantity(
                                    e.target.value,
                                    item?.price,
                                    item?.id
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
                                backgroundColor: "#f1f8ff",
                              }}
                            >
                              <Typography>{subtotal[item?.id]}৳</Typography>
                            </Stack>
                          </Stack>
                        </Stack>
                      ))}

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
                            f
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
                        border: "1px solid #2263a5",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 10,
                      }}
                    >
                      Products That Don't Accept Commission
                    </Typography>

                    <Stack
                      sx={{
                        flexDirection: "row",
                        borderBottomWidth: 1,
                        borderColor: "black",
                      }}
                    >
                      <Stack
                        sx={{
                          width: 70,
                          height: 50,
                          justifyContent: "space-evenly",
                          alignItems: "center",
                          backgroundColor: "#2263a5",
                          borderLeftWidth: 1,
                          borderColor: "#f1f8ff",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: 10,
                          }}
                        >
                          Price
                        </Typography>
                      </Stack>
                      <Stack
                        sx={{
                          width: 160,
                          height: 50,
                          justifyContent: "space-evenly",
                          alignItems: "center",
                          backgroundColor: "#2263a5",
                          borderLeftWidth: 1,
                          borderColor: "#f1f8ff",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: 10,
                          }}
                        >
                          Name
                        </Typography>
                      </Stack>
                      <Stack
                        sx={{
                          width: 70,
                          height: 50,
                          justifyContent: "space-evenly",
                          alignItems: "center",
                          backgroundColor: "#2263a5",
                          borderLeftWidth: 1,
                          borderColor: "#f1f8ff",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: 10,
                          }}
                        >
                          Quantity
                        </Typography>
                      </Stack>
                      <Stack
                        sx={{
                          width: 70,
                          height: 50,
                          justifyContent: "space-evenly",
                          alignItems: "center",
                          backgroundColor: "#2263a5",
                          borderLeftWidth: 1,
                          borderColor: "#f1f8ff",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: 10,
                          }}
                        >
                          Subtotal
                        </Typography>
                      </Stack>
                    </Stack>

                    {/* Product list that does not accept Commission */}
                    {products
                      .filter((item) => item?.acceptCommission !== true)
                      .map((item) => (
                        <Stack key={item?.id}>
                          <Stack
                            sx={{
                              flexDirection: "row",
                              borderBottomWidth: 1,
                              borderColor: "black",
                            }}
                          >
                            <Stack
                              sx={{
                                borderLeftWidth: 1,
                                borderColor: "#ffffff",
                                width: 70,
                                height: 50,
                                justifyContent: "space-evenly",
                                alignItems: "center",
                                backgroundColor: "#f1f8ff",
                              }}
                            >
                              <Typography style={{ color: "red" }}>
                                {item?.price}
                              </Typography>
                            </Stack>
                            <Stack
                              sx={{
                                borderLeftWidth: 1,
                                borderColor: "#ffffff",
                                width: 160,
                                height: 50,
                                justifyContent: "space-evenly",
                                alignItems: "center",
                                backgroundColor: "#f1f8ff",
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
                                {item?.name}
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
                                f
                                placeholder="0"
                                onChange={(e) =>
                                  handleQuantity2(
                                    e.target.value,
                                    item?.price,
                                    item?.id
                                  )
                                }
                              />
                            </Stack>
                            <Stack
                              sx={{
                                borderLeftWidth: 1,
                                borderColor: "#ffffff",
                                width: 70,
                                height: 50,
                                justifyContent: "space-evenly",
                                alignItems: "center",
                                backgroundColor: "#f1f8ff",
                              }}
                            >
                              <Typography>{subtotal2[item?.id]}৳</Typography>
                            </Stack>
                          </Stack>
                        </Stack>
                      ))}

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
                      f
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
                      f
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
                  onClick={() => handleOrder()}
                  fullWidth
                  variant="contained"
                >
                  Confirm Order
                </Button>
              </Stack>
            </Stack>
          </>
        )}
      </Container>
    </>
  );
};

export default EntryForm;
