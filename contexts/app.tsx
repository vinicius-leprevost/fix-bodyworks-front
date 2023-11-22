"use client";
import { createContext, useContext } from "react";
import { AuthContext } from "./auth";

type AppContextProps = {};

export const AppContext = createContext<AppContextProps>({} as AppContextProps);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const {} = useContext(AuthContext);
  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
}
