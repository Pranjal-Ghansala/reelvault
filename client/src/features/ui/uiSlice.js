import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  toasts: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    addToast: {
      reducer(state, action) {
        state.toasts.push(action.payload);
      },
      prepare({ type = "info", message }) {
        return {
          payload: {
            id: nanoid(),
            type,
            message,
          },
        };
      },
    },

    removeToast(state, action) {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
    },
  },
});

export const { addToast, removeToast } = uiSlice.actions;

export default uiSlice.reducer;