import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCookie, setCookie } from "cookies-next";
import axios from "axios";
import ShowToast from "@/Toast/ShowToast";

export const UserLogin = createAsyncThunk(
  "UserLogin",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        {
          email: payload.User.email,
          password: payload.User.password,
          device_token: "EEEEEEEEEE",
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
    } catch (err) {
      ShowToast("error", err.response.data.message);
      return rejectWithValue(err.response.data);
    }
  }
);

export const GetUser = createAsyncThunk(
  "User/GetUser",
  async (payload, { rejectWithValue }) => {
    const { Token } = JSON.parse(getCookie("Template_Cookies"));

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/profile`,
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
    } catch (err) {
      ShowToast("error", err.response.data.message);
      return rejectWithValue(err.response.data);
    }
  }
);

export const UpdateUser = createAsyncThunk(
  "User/UpdateUser",
  async (payload, { rejectWithValue }) => {
    const { Token } = JSON.parse(getCookie("Template_Cookies"));

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/profile`,
        {
          ...payload,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": getCookie("NEXT_LOCALE") || "en",
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      ShowToast("success", response.data.message);
      return response.data;
    } catch (err) {
      ShowToast("error", err.response.data.message);
      return rejectWithValue(err.response.data);
    }
  }
);

export const UpdateUserPassword = createAsyncThunk(
  "User/UpdateUser",
  async (payload, { rejectWithValue }) => {
    const { Token } = JSON.parse(getCookie("Template_Cookies"));

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/change-password`,
        {
          ...payload,
          _method: "PUT",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": getCookie("NEXT_LOCALE") || "en",
            Accept: "application/json",
            Authorization: `Bearer ${Token}`,
            version: 1,
          },
        }
      );
      ShowToast("success", response.data.message);
      return response.data;
    } catch (err) {
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
  },
  extraReducers: (builder) => {
    builder.addCase(UserLogin.pending, (state, action) => {
      state.IsLoading = true;
    });
    builder.addCase(UserLogin.fulfilled, (state, action) => {
      setCookie("Template_Cookies", {
        id: action.payload.data.id,
        Token: action.payload.data.token,
      });
      if (action.payload.status == 1) {
        state.User = action.payload.data;
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
      setCookie("Template_Cookies", {
        id: action.payload.data.id,
        Token: action.payload.data.token,
      });
      if (action.payload.status == 1) {
        state.User = action.payload.data;
        state.IsLoading = false;
        state.IsLogin = true;
      }
    });
    builder.addCase(GetUser.rejected, (state, action) => {
      state.IsLoading = false;
    });
  },
});
export const { GetUserData } = UserSlice.actions;
export default UserSlice.reducer;
