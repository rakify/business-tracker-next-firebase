import { Container, Typography } from "@mui/material";
import Head from "next/head";
import React from "react";
import SellerList from "./seller";

const Admin = () => {
  return (
    <>
      <Head>
        <title>Welcome Admin</title>
        <meta
          name="description"
          content="Business tracker is a web application for business people to record and to calculate their sells faster"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <SellerList />
      </Container>
    </>
  );
};

export default Admin;
