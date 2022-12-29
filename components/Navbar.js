import React from "react";
import {
  Button,
  Typography,
  Stack,
  AppBar,
  Toolbar,
  Tooltip,
} from "@mui/material";
import { logout } from "../redux/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { LogoutRounded, Store } from "@mui/icons-material";

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
            <Typography
              variant="h6"
              sx={{ display: { xs: "none", md: "block" } }}
            >
              Business Tracker
            </Typography>
            <Typography
              variant="h6"
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <Store fontSize="large" />
            </Typography>
          </Link>
          {user?.accountType === "Seller" ? (
            <Stack direction="row" alignItems="center" gap={2}>
              <Link href="/products/">Products</Link>
              <Link href="/orders/">Orders</Link>
              <Link href="/salesman/">Salesman</Link>
              <Link href="/settings/">Settings</Link>

              <Button size="small" onClick={() => logout(dispatch)}>
                <Tooltip title="Logout">
                  <LogoutRounded
                    fontSize="small"
                    sx={{ backgroundColor: "white" }}
                  />
                </Tooltip>
              </Button>
            </Stack>
          ) : user?.accountType === "Salesman" ? (
            <Stack direction="row" alignItems="center" gap={2}>
              <Link href="/orders">Orders</Link>
              <Button size="small" onClick={() => logout(dispatch)}>
                <Tooltip title="Logout">
                  <LogoutRounded
                    fontSize="small"
                    sx={{ backgroundColor: "white" }}
                  />
                </Tooltip>
              </Button>
            </Stack>
          ) : user?.accountType === "Admin" ? (
            <Stack direction="row" alignItems="center" gap={2}>
              <Button size="small" onClick={() => logout(dispatch)}>
                <Tooltip title="Logout">
                  <LogoutRounded
                    fontSize="small"
                    sx={{ backgroundColor: "white" }}
                  />
                </Tooltip>
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
