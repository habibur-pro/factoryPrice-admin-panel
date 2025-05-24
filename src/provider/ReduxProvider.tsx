"use client";
import { store } from "@/redux/store";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";


const ReduxProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <Toaster />
      {children}
    </Provider>
  );
};
export default ReduxProvider;