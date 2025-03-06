import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const memeSlice = createSlice({
  name: "memes",
  initialState: { memes: [], loading: false },
  reducers: {
    setMemes: (state, action) => {
      state.memes = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setMemes, setLoading } = memeSlice.actions;

export const fetchMemes = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get("https://memeverse-kihy.vercel.app/api/memes");
    dispatch(setMemes(res.data));
  } catch (err) {
    console.error(err);
  } finally {
    dispatch(setLoading(false));
  }
};

export default memeSlice.reducer;
