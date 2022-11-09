import {
  loginFailure,
  loginStart,
  loginSuccess,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  getUserStart,
  getUserSuccess,
  getUserFailure,
  logoutSuccess,
  logoutFailure,
  logoutStart,
} from "./userRedux";
import {
  getEntriesStart,
  getEntriesSuccess,
  getEntriesFailure,
  deleteEntriesStart,
  deleteEntriesSuccess,
  deleteEntriesFailure,
  updateEntriesStart,
  updateEntriesSuccess,
  updateEntriesFailure,
  addEntriesStart,
  addEntriesSuccess,
  addEntriesFailure,
} from "./entryRedux";
import { auth, db } from "../config/firebase";
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";

export const getUserData = async (dispatch, uid) => {
  dispatch(getUserStart());
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    dispatch(getUserSuccess(docSnap.data()));
  } catch (err) {
    console.log(err);
    dispatch(getUserFailure());
  }
};

// export const getUserData = async () => {
//   if (docSnap.exists()) {
//     console.log("Document data:", docSnap.data());
//   } else {
//     // doc.data() will be undefined in this case
//     console.log("No such document!");
//   }
// };

export const addData = async () => {
  const docSnapShot = await getDocs(collection(db, "users"));
  docSnapShot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
  });
};

export const logout = async dispatch => {
  dispatch(logoutStart());
  try {
    await auth.signOut();
    dispatch(logoutSuccess());
  } catch (err) {
    console.log(err);
    dispatch(logoutFailure());
  }
};