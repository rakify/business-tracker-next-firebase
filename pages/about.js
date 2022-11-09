import { useEffect } from "react";
import { addData, getUserData } from "../redux/apiCalls";

const about = () => {
  useEffect(() => {
    getUserData();
  }, []);
  return <div>about page ok</div>;
};

export default about;
