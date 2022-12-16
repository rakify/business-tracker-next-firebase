import React from "react";
import Login from "../login";
import Salesman from "../../components/Salesman";
import { useSelector } from "react-redux";
import Head from "next/head";

const SalesmanIndex = () => {
  const user = useSelector((state) => state.user.currentUser);
  return (
    <>
      <Head>
        <title>Your Salesman - Business Tracker</title>
        <meta
          name="description"
          content="Business tracker is a web application for business people to record and to calculate their sells faster"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {user ? <Salesman /> : <Login from="Your Salesman" />}
    </>
  );
};

export default SalesmanIndex;
