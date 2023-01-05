import React, { useState } from "react";
import {
  Button,
  Typography,
  Stack,
  AppBar,
  Toolbar,
  Tooltip,
  Badge,
  styled,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { logout } from "../redux/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import {
  MenuOutlined,
  Logout,
  LogoutRounded,
  ManageAccounts,
  Store,
  ReceiptLong,
  Person,
  ViewList,
  PersonAddAlt1,
} from "@mui/icons-material";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
          {user?.accountType === "Seller" ||
          user?.accountType === "Salesman" ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
              sx={{ width: 30, height: 30 }}
            >
              <Avatar
                alt="menu"
                sx={{
                  width: 30,
                  height: 30,
                  cursor: "pointer",
                  backgroundColor: "white",
                }}
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                onMouseOver={handleClick}
              >
                <MenuOutlined color="primary" />
              </Avatar>
            </StyledBadge>
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

      {/* Menu on click profile picture */}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
          onMouseLeave: handleClose,
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{ pointer: "grab" }}
      >
        {user?.accountType === "Seller" && (
          <MenuItem>
            <Link
              href="/profile/"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Person /> Profile
            </Link>
          </MenuItem>
        )}
        <MenuItem>
          <Link
            href="/orders/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ReceiptLong /> Orders
          </Link>
        </MenuItem>
        <MenuItem>
          <Link
            href="/products"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ViewList /> Products
          </Link>
        </MenuItem>
        {user?.accountType === "Seller" && (
          <MenuItem>
            <Link
              href="/salesman"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <PersonAddAlt1 /> Salesmen
            </Link>
          </MenuItem>
        )}
        <Divider variant="middle" />
        <Button
          size="small"
          variant="contained"
          sx={{ display: "flex", alignItems: "center", color: "white", gap: 1 }}
          onClick={() => logout(dispatch)}
        >
          <Logout fontSize="small" />
          Logout
        </Button>
      </Menu>
    </>
  );
};

export default Navbar;
