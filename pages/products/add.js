import React from "react";
import Login from "../login";
import AddProduct from "../../components/AddProduct";
import { useSelector } from "react-redux";
import Head from "next/head";

const AddProductIndex = () => {
  const user = useSelector((state) => state.user.currentUser);
  return (
    <>
      <Head>
        <title>Add Product - Business Tracker</title>
        <meta
          name="description"
          content="Business tracker is a web application for business people to record and to calculate their sells faster"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {user ? <AddProduct /> : <Login from="Add Product" />}
    </>
  );
};

export default AddProductIndex;
