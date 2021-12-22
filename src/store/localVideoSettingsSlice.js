import { createSlice } from "@reduxjs/toolkit";

const localVideoSettingsSlice = createSlice({
  name: "localVideoSettings",
  initialState: {
    localVideoSettings: {
      video: true,
      audio: true,
    },
  },
  reducers: {
    setVideo(state, action) {
      state.localVideoSettings.video = action.payload.turnOn;
    },
    setAudio(state, action) {
      state.localVideoSettings.audio = action.payload.turnOn;
    },
  },
});

export const { setVideo, setAudio } = localVideoSettingsSlice.actions;
export default localVideoSettingsSlice.reducer;
