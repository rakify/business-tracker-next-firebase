import { Container } from "@mui/material";
import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <Container maxWidth="lg" disableGutters>
      <Navbar />
      {children}
      <Footer />
    </Container>
  );
};

export default Layout;
