import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: { message: "", class: "success", timer: 0 },
  reducers: {
    createNotification(state, action) {
      state = action.payload;
      return state;
    },
    removeNotification(state) {
      state.message = "";
    },
  },
});

let notificationTimeout = null;
export const notify = (notification, timeSeconds = 5) => {
  return (dispatch) => {
    dispatch(createNotification(notification));

    // clear previous timer if it exists
    clearTimeout(notificationTimeout);

    // start new timer
    notificationTimeout = setTimeout(() => {
      dispatch(removeNotification());
    }, timeSeconds * 1000);
  };
};

export const { createNotification, removeNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
