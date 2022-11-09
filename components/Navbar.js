import React from "react";
import styles from "../styles/Navbar.module.css";
import { Button, Typography, Stack } from "@mui/material";
import { logout } from "../redux/apiCalls";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const dispatch = useDispatch();
  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ backgroundColor: "aliceblue", p: 1 }}
      >
        <Typography sx={{ display: "flex", alignItems: "center" }}>
          Business Tracker
        </Typography>
        <Button
          variant="outlined"
          sx={{ color: "red" }}
          onClick={() => logout(dispatch)}
        >
          Logout
        </Button>
      </Stack>
    </>
  );
};

export default Navbar;
