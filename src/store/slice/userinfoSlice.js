import { createSlice } from "@reduxjs/toolkit";

const userinfoSlice = createSlice({
  name: "userinfo",
  initialState: {
    userId: null,
    userinfo: null,
    isLoggedIn: false,
    profilePictureUrl: "",
    coverPhotoUrl: "",
  },
  reducers: {
    setUserinfo: (state, action) => {
      state.userinfo = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setProfilePictureUrl: (state, action) => {
      state.profilePictureUrl = action.payload;
    },
    setCoverPhotoUrl: (state, action) => {
      state.coverPhotoUrl = action.payload;
    },
  },
});

export const { setUserinfo, setIsLoggedIn, setUserId, setProfilePictureUrl, setCoverPhotoUrl } = userinfoSlice.actions;
export default userinfoSlice.reducer;
