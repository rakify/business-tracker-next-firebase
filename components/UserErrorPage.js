import Navbar from "./Navbar"
import React from "react";

const UserErrorPage = ({ message }) => {
  return (
    <>
      <Navbar />
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          WebkitTransform: "translate(-50%, -50%)",
          transform: "translate(-50%, -50%)",
          color: "red",
          fontWeight: "bolder",
        }}
      >
        {message}
        {/* <a href="mailto:rakify14@gmail.com">rakify14@gmail.com</a> */}
      </div>
    </>
  );
};
export default UserErrorPage;
