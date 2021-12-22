import { configureStore } from "@reduxjs/toolkit";
import deviceSettingsReducer from "./deviceSettingsSlice";
import localVideoSettingsReducer from "./localVideoSettingsSlice";
import peopleReducer from "./peopleSlice";

export default configureStore({
  reducer: {
    deviceSettings: deviceSettingsReducer,
    localVideoSettings: localVideoSettingsReducer,
    people: peopleReducer,
  },
});
