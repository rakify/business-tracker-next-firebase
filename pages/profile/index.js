import React from "react";
import Login from "../login";
import { useSelector } from "react-redux";
import Head from "next/head";
import Profile from "../../components/Profile";

const ProfileIndex = () => {
  const user = useSelector((state) => state.user.currentUser);
  return (
    <>
      <Head>
        <title>Profile - Business Tracker</title>
        <meta
          name="description"
          content="Business tracker is a web application for business people to record and to calculate their sells faster"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {user ? <Profile /> : <Login from="Profile" />}
    </>
  );
};

export default ProfileIndex;
