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
  ManageHistory,
} from "@mui/icons-material";
import { useRouter } from "next/router";

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
  const router = useRouter();
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
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Business Tracker
            </Typography>
            <Typography
              variant="h6"
              sx={{ display: { xs: "block", sm: "none" } }}
            >
              <Store fontSize="large" />
            </Typography>
          </Link>
          {user?.accountType === "Seller" ||
          user?.accountType === "Salesman" ? (
            <>
              <Stack
                direction="row"
                gap={1}
                sx={{ display: { xs: "none", sm: "flex" } }}
              >
                <Button
                  size="small"
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "white",
                    border:
                      router.route.slice(1) === "" && "4px solid currentColor",
                  }}
                >
                  <Link
                    href="/"
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    Cash Memo
                  </Link>
                </Button>
                {user?.accountType === "Seller" && (
                  <>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "white",
                        border:
                          router.route.slice(1) === "profile" &&
                          "4px solid currentColor",
                      }}
                    >
                      <Link
                        href="/profile"
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        Profile
                      </Link>
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "white",
                        border:
                          router.route.slice(1) === "products" &&
                          "4px solid currentColor",
                      }}
                    >
                      <Link
                        href="/products"
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        Products
                      </Link>
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "white",
                        border:
                          router.route.slice(1) === "salesman" &&
                          "4px solid currentColor",
                      }}
                    >
                      <Link
                        href="/salesman"
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        Salesman
                      </Link>
                    </Button>
                  </>
                )}
                <Button
                  size="small"
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "white",
                    border:
                      router.route.slice(1) === "orders" &&
                      "4px solid currentColor",
                  }}
                >
                  <Link
                    href="/orders"
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    Orders
                  </Link>
                </Button>
              </Stack>
              <Stack
                sx={{ display: { xs: "none", sm: "flex" } }}
                direction="row"
                alignItems="center"
                gap={1}
              >
                <Typography>
                  Welcome <b>{user?.accountType}</b>
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "white",
                  }}
                  onClick={() => logout(dispatch)}
                >
                  Logout
                </Button>
              </Stack>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                sx={{
                  width: 30,
                  height: 30,
                  display: { xs: "block", sm: "none" },
                }}
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
            </>
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
        <MenuItem>
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ManageHistory /> Cash Memo
          </Link>
        </MenuItem>

        {user?.accountType === "Seller" && (
          <>
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
          </>
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
