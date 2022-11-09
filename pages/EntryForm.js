import { Container, Typography, Stack, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const EntryForm = () => {
  const user = useSelector((state) => state.user.currentUser);
  const products =
    useSelector((state) => state.user.currentUser?.products) || 0;

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
    costForWithCommition: 0.0, // todays total cost for commision based product
    commitionPercentage: 0.0, // perchantage of discount
    commitionValue: 0.0, // discount ammount
    costAfterCommition: 0.0,
    costForWithoutCommition: 0.0, // todays total cost for without commision based product
    finalCost: 0.0, // costAfterCommition+costWithoutCommition
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
  console.log(date);

  //handle number values - commisionPerchantage, previousReserve, reserve
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
  // for product with commition
  const [quantity, setQuantity] = useState({ ...initialQuantity });
  const [subtotal, setSubtotal] = useState({ ...initialQuantity });
  // for product without commision
  const [quantity2, setQuantity2] = useState({ ...initialQuantity });
  const [subtotal2, setSubtotal2] = useState({ ...initialQuantity });

  // Handle change in quantity and also update subtotal for commision based product
  const handleQuantity = (valuePassed, price, id) => {
    let value = 0;
    if (valuePassed !== "" && !isNaN(valuePassed)) value = valuePassed;
    let subtotal = value * price;
    setSubtotal((prev) => {
      return { ...prev, [id]: subtotal.toFixed(2) };
    });
    setQuantity((prev) => {
      return { ...prev, [id]: value };
    });
  };

  // Handle change in quantity and also update subtotal for without commision based product
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

  //with change in subtotal, update total cost value for commision based product
  useEffect(() => {
    let total = 0.0;
    for (let item in subtotal) {
      total += parseFloat(subtotal[item]);
    }
    setInputs((prev) => ({ ...prev, costForWithCommition: total.toFixed(2) }));
  }, [subtotal]);

  //with change in subtotal2, update total cost value for without commision product
  useEffect(() => {
    let total = 0;
    for (let item in subtotal2) {
      total += parseFloat(subtotal2[item]);
    }
    setInputs((prev) => ({
      ...prev,
      costForWithoutCommition: total.toFixed(2),
    }));
  }, [subtotal2]);

  //with change in commition, update commition Value and cost after commition
  useEffect(() => {
    let costAfterCommition = 0.0;
    let commitionValue = 0.0;
    if (inputs.commitionPercentage !== 0)
      commitionValue =
        (inputs.commitionPercentage / 100.0) * inputs.costForWithCommition;
    costAfterCommition = inputs.costForWithCommition - commitionValue;
    setInputs((prev) => ({
      ...prev,
      commitionValue: commitionValue.toFixed(2),
    }));
    setInputs((prev) => ({
      ...prev,
      costAfterCommition: costAfterCommition.toFixed(2),
    }));
  }, [inputs.commitionPercentage, inputs.costForWithCommition]);

  //with change in costAfterCommition, costForWithoutCommition, update final cost
  useEffect(() => {
    let finalCost =
      parseFloat(inputs.costAfterCommition) +
      parseFloat(inputs.costForWithoutCommition);
    setInputs((prev) => ({ ...prev, finalCost: finalCost.toFixed(2) }));
  }, [inputs.costAfterCommition, inputs.costForWithoutCommition]);

  //with change in finalCost, previous reserve and todays reserve, update final reserve, finalCost2
  useEffect(() => {
    let finalCost2 = -parseFloat(inputs.previousReserve) - inputs.finalCost;
    let finalReserve = parseFloat(inputs.reserve) + finalCost2;
    setInputs((prev) => ({ ...prev, finalReserve: finalReserve.toFixed(2) }));
    setInputs((prev) => ({ ...prev, finalCost2: finalCost2.toFixed(2) }));
  }, [inputs.finalCost, inputs.previousReserve, inputs.reserve]);

  let productWithoutCommition = [];
  if (products)
    productWithoutCommition = products?.filter(
      (item) => item?.acceptCommition !== true
    );

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
                <Typography sx={{ fontWeight: "bold" }}>
                  Time: {dateArray[1]}
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

            <Stack direction="row" justifyContent="space-evenly">
              {/* There exists product with commision */}
              <Stack>
                {productWithoutCommition.length !== products.length && (
                  <>
                    <Typography variant="overline">
                      Products That Accept Commision
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
                      .filter((item) => item?.acceptCommition === true)
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

                    {/* Calculations Part For Product that accepts commision */}
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
                            মোট
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
                            {inputs.costForWithCommition}৳
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
                            কমিশন (-)
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
                                "commitionPercentage",
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
                          <Typography>{inputs.commitionValue}৳</Typography>
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
                          <Typography>{inputs.costAfterCommition}৳</Typography>
                        </Stack>
                      </Stack>
                    </>
                  </>
                )}
              </Stack>
              {/* Product That Doesnt Accept Commision */}
              <Stack>
                {productWithoutCommition.length !== 0 && (
                  <>
                    <Typography variant="overline">
                      Products That Doesn't Accept Commision
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

                    {/* Product list that does not accept Commition */}
                    {products
                      .filter((item) => item?.acceptCommition !== true)
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

                    {/* Result of Product that doesnt accept commision */}
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
                          {inputs.costForWithoutCommition}৳
                        </Typography>
                      </Stack>
                    </Stack>
                  </>
                )}
              </Stack>
            </Stack>
          </>
        )}

        {/* FInal Calculations Part */}
        <Stack alignItems="center" sx={{ border: "1px solid #2263a5" }}>
          <Typography
            variant="overline"
            sx={{ backgroundColor: "#2263a5", color: "white" }}
          >
            Final Result
          </Typography>

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
                {inputs.costForWithoutCommition} + {inputs.costAfterCommition}
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
                সাবেক টাকা
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
                জমা
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
                মোট বাকি টাকা
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
        </Stack>
      </Container>
    </>
  );
};

export default EntryForm;
