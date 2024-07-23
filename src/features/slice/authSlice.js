import { createSlice } from "@reduxjs/toolkit";
import { decrypt, encrypt } from "../../utils/encrypt";

const { decryptedData: decryptedToken } = decrypt(
  sessionStorage.getItem("token")
);
const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!decryptedToken,
    token: decryptedToken,
    user: JSON.parse(sessionStorage.getItem("user")),
    pokedData: null,
  },
  reducers: {
    loginSlice: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logoutSlice: (state) => {
      state.isAuthenticated = false;
      state.token = null;
    },
    setPokedData: (state, action) => {
      state.pokedData = action.payload;
    },
  },
});

export const { loginSlice, logoutSlice, setPokedData } = authSlice.actions;
export default authSlice.reducer;
