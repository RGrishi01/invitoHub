import { createContext, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [userEmail, setUserEmail] = useState({});
  const [userId, setUserId] = useState("");
  return (
    <UserContext.Provider value={{ userId, setUserId, userEmail, setUserEmail }}>
      {children}
    </UserContext.Provider>
  );
}
