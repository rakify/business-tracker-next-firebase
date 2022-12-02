import { Container } from "@mui/material";
import React from "react";
import Footer from "./footer";
import Navbar from "./navbar";

const Layout = ({ children }) => {
  return (
    <Container>
      <Navbar />
      {children}
      <Footer />
    </Container>
  );
};

export default Layout;
