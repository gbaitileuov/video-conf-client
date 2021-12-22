import { createSlice } from "@reduxjs/toolkit";

const peopleSlice = createSlice({
  name: "people",
  initialState: {
    people: [],
  },
  reducers: {
    addPeople(state, action) {
      state.people.push({
        id: action.payload.id,
        name: action.payload.name,
        role: action.payload.role,
      });
    },
    removePeople(state, action) {
      state.people = state.people.filter((people) => people.id !== action.payload.id);
    },
  },
});

export const { addPeople, removePeople } = peopleSlice.actions;
export default peopleSlice.reducer;
