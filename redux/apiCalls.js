import {
  getUserStart,
  getUserSuccess,
  getUserFailure,
  logoutSuccess,
  logoutFailure,
  logoutStart,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "./userRedux";
import { auth, db } from "../config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  addProductFailure,
  addProductStart,
  addProductSuccess,
  deleteProductFailure,
  deleteProductStart,
  deleteProductSuccess,
  getProductFailure,
  getProductStart,
  getProductSuccess,
  resetProduct,
  updateProductFailure,
  updateProductStart,
  updateProductSuccess,
} from "./productRedux";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";

//Admin
export const getAllUsers = async () => {
  try {
  } catch (err) {
    console.log(err);
  }
};

//Seller
// get single product data
export const getProduct = async (id) => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    console.log(docSnap.exists());
    if (docSnap.exists()) return docSnap.data();
  } catch (err) {
    console.log(err);
  }
};
//add
export const addProduct = async (dispatch, productInfo) => {
  dispatch(addProductStart());
  try {
    await setDoc(doc(db, "products", productInfo.id), productInfo);
    dispatch(addProductSuccess(productInfo));
    return {
      type: "success",
      message: "New product added successfully.",
    };
  } catch (err) {
    dispatch(addProductFailure());
    return {
      type: "error",
      message: err.message,
    };
  }
};
//update
export const updateProduct = async (dispatch, id, product) => {
  dispatch(updateProductStart());
  try {
    await setDoc(doc(db, "products", id), product);
    dispatch(updateProductSuccess(id, product));
    return {
      type: "success",
      message: "Product updated successfully.",
    };
  } catch (err) {
    dispatch(updateProductFailure());
    return {
      type: "error",
      message: err.message,
    };
  }
};
export const updateProductQuantity = async (id, value, type) => {
  try {
    // Atomically decrement the stock of the product by given value.
    await updateDoc(doc(db, "products", id), {
      stock: type === "dec" ? increment(-value) : increment(value),
    });
    return {
      type: "success",
      message: "Product stock updated successfully.",
    };
  } catch (err) {
    return {
      type: "error",
      message: err.message,
    };
  }
};
//delete
export const deleteProduct = async (dispatch, id) => {
  dispatch(deleteProductStart());
  try {
    const productRef = doc(db, "products", id);
    await deleteDoc(productRef);
    dispatch(deleteProductSuccess(id));
    return {
      type: "success",
      message: "Product deleted successfully.",
    };
  } catch (err) {
    dispatch(deleteProductFailure());
    return {
      type: "error",
      message: err.message,
    };
  }
};

//Seller + Salesman
//User
export const addUserData = async (userInfo) => {
  try {
    await setDoc(doc(db, "users", userInfo.uid), userInfo);
    return {
      type: "success",
      message: "New account created successfully, You may login now.",
    };
  } catch (err) {
    console.log(err);
    return { type: "error", message: err };
  }
};
export const getUserData = async (dispatch, uid) => {
  dispatch(getUserStart());
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    dispatch(getUserSuccess(docSnap.data()));
    return { type: "success", message: "Logged In Successfully." };
  } else {
    dispatch(getUserFailure());
    return { type: "error", message: "Your account is banned." };
  }
};
//update
export const updateUser = async (dispatch, uid, userInfo) => {
  dispatch(updateUserStart());
  try {
    await setDoc(doc(db, "users", uid), userInfo);
    dispatch(updateUserSuccess(userInfo));
    return {
      type: "success",
      message: "User updated successfully.",
    };
  } catch (err) {
    dispatch(updateUserFailure());
    return {
      type: "error",
      message: err.message,
    };
  }
};
//delete
export const deleteUser = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    await deleteDoc(userRef);
    return { type: "success", message: "Successfully deleted user." };
  } catch (err) {
    console.log("Error deleting user:", err);
    return {
      type: "error",
      message: err.message,
    };
  }
};
//Products
export const getProductData = async (dispatch, uid) => {
  dispatch(getProductStart());
  try {
    const q = query(collection(db, "products"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    let products = [];
    querySnapshot.forEach((doc) => {
      products.push(doc.data());
    });
    dispatch(getProductSuccess(products));
  } catch (err) {
    console.log(err);
    dispatch(getProductFailure());
  }
};
//Salesman
export const addSalesmanData = async (userInfo) => {
  try {
    await setDoc(doc(db, "users", userInfo.salesmanUid), userInfo);
    return {
      type: "success",
      message: "New  salesman account created successfully.",
    };
  } catch (err) {
    return { type: "error", message: err };
  }
};

export const getSalesmanData = async (uid) => {
  try {
    const q = query(
      collection(db, "users"),
      where("uid", "==", uid),
      where("accountType", "==", "Salesman")
    );
    const querySnapshot = await getDocs(q);
    let salesmen = [];
    querySnapshot.forEach((doc) => {
      salesmen.push(doc.data());
    });
    return { status: 200, data: salesmen };
  } catch (err) {
    console.log(err);
    return err;
  }
};

// Orders
export const addOrder = async (orderInfo) => {
  try {
    const res = await setDoc(doc(db, "orders", orderInfo.id), orderInfo);
    console.log(res);
    return {
      type: "success",
      message: "New order placed.",
    };
  } catch (err) {
    return {
      type: "error",
      message: "Failed to order.",
    };
  }
};
//delete
export const deleteOrder = async (uid) => {
  try {
    const orderRef = doc(db, "orders", uid);
    await deleteDoc(orderRef);
    return { type: "success", message: "Successfully deleted order." };
  } catch (err) {
    console.log("Error while deleting order:", err);
    return {
      type: "error",
      message: err.message,
    };
  }
};
export const getOrderData = async (uid) => {
  try {
    const q = query(collection(db, "orders"), where("seller", "==", uid));
    const querySnapshot = await getDocs(q);
    let orders = [];
    querySnapshot.forEach((doc) => {
      orders.push(doc.data());
    });
    return orders;
  } catch (err) {
    console.log(err);
    return err;
  }
};

// All
export const login = async (dispatch, email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const res = await getUserData(dispatch, userCredential.user.uid);
    return res;
  } catch (error) {
    return {
      type: "error",
      message:
        error.code === "auth/invalid-email"
          ? "Invalid email."
          : error.code === "auth/user-not-found"
          ? "User not found."
          : error.code === "auth/wrong-password"
          ? "Wrong password."
          : "Network error.",
    };
  }
};
export const logout = async (dispatch) => {
  dispatch(logoutStart());
  try {
    dispatch(resetProduct());
    dispatch(logoutSuccess());
  } catch (err) {
    console.log(err);
    dispatch(logoutFailure());
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return 200;
  } catch (err) {
    console.log(err);
    console.log(err.code);
    return err.code;
  }
};
