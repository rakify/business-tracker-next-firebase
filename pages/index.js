import Head from "next/head";
import Image from "next/image";
import { useSelector } from "react-redux";
import styles from "../styles/Index.module.css";
import EntryForm from "./EntryForm";
import Login from "./login";

export default function Home() {
  const user = useSelector((state) => state.user.currentUser);
  return (
    <>
      <Head>
        <title>Business Tracker</title>
        <meta
          name="description"
          content="Business tracker is a web application for business people to record and to calculate their sells faster"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {user ? <EntryForm /> : <Login />}
    </>
  );
}
