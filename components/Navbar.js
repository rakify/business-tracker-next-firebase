import React from "react";
import styles from "../styles/Navbar.module.css";
import { Button, Typography, Stack, AppBar, Toolbar } from "@mui/material";
import { logout } from "../redux/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  return (
    <>
      <AppBar>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link href="/">
            <Typography variant="h6">Business Tracker</Typography>
          </Link>
          {user ? (
            <Stack direction="row" alignItems="center" gap={2}>
              <Link href="/profile">Profile</Link>
              <Link href="/products">Products</Link>
              <Link href="/products">Customers</Link>
              <Link href="/products">Orders</Link>
              <Button
                sx={{ backgroundColor: "white" }}
                color="secondary"
                onClick={() => logout(dispatch)}
              >
                Logout
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" gap={2}>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default Navbar;
