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
    const backendRes = await axios.get(
      "https://memeverse-backend.vercel.app/api/memes"
    );
    const apiRes = await axios.get("https://api.imgflip.com/get_memes");

    const apiMemes = apiRes.data.data.memes.map((meme) => ({
      id: meme.id,
      name: meme.name,
      url: meme.url,
      likes: 0,
      owner: null,
    }));

    const userMemes = backendRes.data.map((meme) => ({
      id: meme._id,
      name: meme.caption,
      url: meme.imageUrl,
      likes: meme.likes,
      owner: meme.owner,
    }));

    dispatch(
      setMemes([...apiMemes, ...userMemes].sort(() => Math.random() - 0.5))
    );
  } catch (err) {
    console.error(err);
  } finally {
    dispatch(setLoading(false));
  }
};

export default memeSlice.reducer;
