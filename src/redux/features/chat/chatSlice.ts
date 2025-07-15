// src/redux/features/chatModalSlice.ts
import { createSlice } from "@reduxjs/toolkit";

export interface ChatModalState {
  isOpen: boolean;
}

const initialState: ChatModalState = {
  isOpen: false,
};

const chatModalSlice = createSlice({
  name: "chatModalToggle",
  initialState,
  reducers: {
    toggleChatModal: (state) => {
      state.isOpen = !state.isOpen;
    },
    closeChatModal: (state) => {
      state.isOpen = false;
    },
    openChatModal: (state) => {
      state.isOpen = true;
    },
  },
});

export const { toggleChatModal, closeChatModal, openChatModal } =
  chatModalSlice.actions;

export default chatModalSlice.reducer;
