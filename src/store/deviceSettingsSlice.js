import { createSlice } from "@reduxjs/toolkit";

const deviceSettingsSlice = createSlice({
  name: "deviceSettings",
  initialState: {
    deviceSettings: {
      audioDevice: "",
      videoDevice: "",
    },
    initialized: false,
  },
  reducers: {
    changeStatus(state, action) {
      state.initialized = action.payload.initialized;
    },
    setAudioDevice(state, action) {
      state.deviceSettings.audioDevice = action.payload.audioDevice;
    },
    setVideoDevice(state, action) {
      state.deviceSettings.videoDevice = action.payload.videoDevice;
    },
  },
});

export const { changeStatus, setAudioDevice, setVideoDevice } = deviceSettingsSlice.actions;
export default deviceSettingsSlice.reducer;
