import React from "react";
import Login from "../login";
import AddProduct from "../../components/AddProduct";
import { useSelector } from "react-redux";
import Head from "next/head";

const AddProductIndex = () => {
  const user = useSelector((state) => state.user.currentUser);
  return <>{user ? <AddProduct /> : <Login from="Add Product" />}</>;
};

export default AddProductIndex;
