import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";

const userContext = React.createContext();

function UserProvider({ children }) {
  const [userData, setUserData] = useState({
    token: undefined,
    username: undefined,
  });

  useEffect(async () => {
    let token = sessionStorage.getItem("auth-token");

    if (token === null) {
      sessionStorage.setItem("auth-token", "");
      token = "";

      //
    }

    const tokenRes = await Axios.post("/auth/tokenIsValid", null, {
      headers: { "x-auth-token": token },
    });

    if (tokenRes.data) {
      const userRes = await Axios.get("/auth/", {
        headers: { "x-auth-token": token },
      });

      setUserData({
        token: userRes.data.token,
        username: userRes.data.username,
      });
    }
  }, []);

  return (
    <userContext.Provider value={{ userData, setUserData }}>
      {children}
    </userContext.Provider>
  );
}

export const useUserContext = () => {
  return useContext(userContext);
};

export { userContext, UserProvider };
