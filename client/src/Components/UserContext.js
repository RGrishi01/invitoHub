import { createContext, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [userEmail, setUserEmail] = useState({});
  return (
    <UserContext.Provider value={{ userEmail, setUserEmail }}>{children}</UserContext.Provider>
  );
}
