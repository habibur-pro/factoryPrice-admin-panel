import baseApi from "./baseApi";
import navReducer from "./features/navSlice";
import chatToggleReducer from "./features/chat/chatSlice";

const reducer = {
  navToggle: navReducer,
  chatToggle: chatToggleReducer,
  [baseApi.reducerPath]: baseApi.reducer,
};
export default reducer;
