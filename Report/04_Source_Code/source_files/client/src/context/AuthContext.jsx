import { createContext, useState, useEffect } from "react";
import { loginUser, registerResident, fetchCurrentUser } from "../api/authApi";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem("hostelfix_token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetchCurrentUser();
        setUser(res.data.data.user);
      } catch (err) {
        localStorage.removeItem("hostelfix_token");
        localStorage.removeItem("hostelfix_user");
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    const { token, user: loggedInUser } = res.data.data;
    localStorage.setItem("hostelfix_token", token);
    localStorage.setItem("hostelfix_user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (payload) => {
    const res = await registerResident(payload);
    const { token, user: newUser } = res.data.data;
    localStorage.setItem("hostelfix_token", token);
    localStorage.setItem("hostelfix_user", JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem("hostelfix_token");
    localStorage.removeItem("hostelfix_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
