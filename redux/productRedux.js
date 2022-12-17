import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    productWithCommission: [],
    productWithoutCommission: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    //Reset
    resetProduct: (state) => {
      state.products = [];
      state.productWithCommission = [];
      state.productWithoutCommission = [];
      state.isFetching = false;
      state.error = false;
    },
    //Get
    getProductStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getProductSuccess: (state, action) => {
      state.isFetching = false;
      state.products = action.payload;
      state.productWithCommission = state.products.filter(
        (item) => item?.acceptCommission === true
      );
      state.productWithoutCommission = state.products.filter(
        (item) => item?.acceptCommission === false
      );
    },
    getProductFailure: (state) => {
      state.isFetching = false;
      state.products = [];
      state.productWithCommission = [];
      state.productWithoutCommission = [];
      state.error = true;
    },
    //Delete
    deleteProductStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    deleteProductSuccess: (state, action) => {
      state.isFetching = false;
      state.products.splice(
        state.products.findIndex((item) => item.id === action.payload.id),
        1
      );
    },
    deleteProductFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    //Update
    updateProductStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    updateProductSuccess: (state, action) => {
      state.isFetching = false;
      state.products[
        state.products.findIndex((item) => item.id === action.payload.id)
      ] = action.payload.product;
    },
    updateProductFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    //Add
    addProductStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    addProductSuccess: (state, action) => {
      state.isFetching = false;
      state.products.push(action.payload);
    },
    addProductFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const {
  getProductStart,
  getProductSuccess,
  getProductFailure,
  deleteProductStart,
  deleteProductSuccess,
  deleteProductFailure,
  updateProductStart,
  updateProductSuccess,
  updateProductFailure,
  addProductStart,
  addProductSuccess,
  addProductFailure,
  resetProduct,
} = productSlice.actions;
export default productSlice.reducer;
