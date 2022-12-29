import React from "react";
import Login from "../login";
import Orders from "../../components/Orders";
import { useSelector } from "react-redux";
import Head from "next/head";

const OrdersIndex = () => {
  const user = useSelector((state) => state.user.currentUser);
  return (
    <>
      <Head>
        <title>Orders - Business Tracker</title>
        <meta
          name="description"
          content="Business tracker is a web application for business people to record and to calculate their sells faster"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {user ? <Orders /> : <Login from="Orders" />}
    </>
  );
};

export default OrdersIndex;
