import React from "react";
import Login from "../login";
import Products from "../../components/Products";
import { useSelector } from "react-redux";
import Head from "next/head";

const ProductsIndex = () => {
  const user = useSelector((state) => state.user.currentUser);
  return (
    <>
      <Head>
        <title>Products - Business Tracker</title>
        <meta
          name="description"
          content="Business tracker is a web application for business people to record and to calculate their sells faster"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {user ? <Products /> : <Login from="Products" />}
    </>
  );
};

export default ProductsIndex;
