import React from "react";
import Login from "../../login";
import EditProduct from "../../../components/EditProduct";
import { useSelector } from "react-redux";
import Head from "next/head";

const EditProductIndex = () => {
  const user = useSelector((state) => state.user.currentUser);
  return (
    <>
      <Head>
        <title>Edit Product - Business Tracker</title>
        <meta
          name="description"
          content="Business tracker is a web application for business people to record and to calculate their sells faster"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {user ? <EditProduct /> : <Login from="Edit Product" />}
    </>
  );
};

export default EditProductIndex;
