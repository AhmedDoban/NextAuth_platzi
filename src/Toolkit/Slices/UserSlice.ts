import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCookie, setCookie } from "cookies-next";
import axios from "axios";
import ShowToast from "@/Toast/ShowToast";

export const UserLogin = createAsyncThunk(
  "UserLogin",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/auth/login`,
        {
          email: payload.email,
          password: payload.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": getCookie("NEXT_LOCALE") || "en",
            Accept: "application/json",
          },
        }
      );
      return response.data;
    } catch (err: any) {
      ShowToast("error", err.response.data.message);
      return rejectWithValue(err.response.data);
    }
  }
);

export const GetUser = createAsyncThunk(
  "User/GetUser",
  async (payload, { rejectWithValue }) => {
    const { Token } = JSON.parse(getCookie("Template_Cookies") || "{}");

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/auth/profile`,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": getCookie("NEXT_LOCALE") || "en",
            Accept: "application/json",
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      return response.data;
    } catch (err: any) {
      ShowToast("error", err.response.data.message);
      return rejectWithValue(err.response.data);
    }
  }
);

const UserSlice = createSlice({
  name: "UserSlice",
  initialState: {
    User: {},
    IsLoading: false,
    IsLogin: false,
  },
  reducers: {
    GetUserData: (State) => {
      const HandleGetUser = getCookie("Template_Cookies");
      if (HandleGetUser != undefined) {
        State.IsLogin = true;
      }
    },
    SetGithubUSer: (State, Payload) => {
      State.IsLogin = true;
      State.User = Payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(UserLogin.pending, (state, action) => {
      state.IsLoading = true;
    });
    builder.addCase(UserLogin.fulfilled, (state, action) => {
      setCookie("Template_Cookies", {
        refresh_token: action.payload.refresh_token,
        Token: action.payload.access_token,
      });
      if (action.payload.status == 1) {
        state.IsLoading = false;
        state.IsLogin = true;
      }
    });
    builder.addCase(UserLogin.rejected, (state, action) => {
      state.IsLoading = false;
    });
    builder.addCase(GetUser.pending, (state, action) => {
      state.IsLoading = true;
    });
    builder.addCase(GetUser.fulfilled, (state, action) => {
      state.User = action.payload;
      state.IsLoading = false;
      state.IsLogin = true;
    });
    builder.addCase(GetUser.rejected, (state, action) => {
      state.IsLoading = false;
    });
  },
});
export const { GetUserData, SetGithubUSer } = UserSlice.actions;
export default UserSlice.reducer;
