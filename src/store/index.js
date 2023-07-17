import { createSlice, configureStore } from "@reduxjs/toolkit";

// Define initial state
const initialState = {
  walletConnected: false,
  providerOrSigner: null,
  address: null,
  provider: null,
};

// Define a slice of the Redux store
const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWalletConnected: (state, action) => {
      state.walletConnected = action.payload;
    },
    setProviderOrSigner: (state, action) => {
      state.providerOrSigner = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setProvider: (state, action) => {
      state.provider = action.payload;
    },
  },
});

export const { setWalletConnected, setProviderOrSigner, setAddress, setProvider } =
  walletSlice.actions;

export default configureStore({ reducer: walletSlice.reducer });
