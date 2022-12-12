import React from "react";
import Login from "../login";
import Settings from "../../components/Settings";
import { useSelector } from "react-redux";
import Head from "next/head";

const SettingsIndex = () => {
  const user = useSelector((state) => state.user.currentUser);
  return (
    <>
      <Head>
        <title>Settings - Business Tracker</title>
        <meta
          name="description"
          content="Business tracker is a web application for business people to record and to calculate their sells faster"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {user ? <Settings /> : <Login from="Settings" />}
    </>
  );
};

export default SettingsIndex;
