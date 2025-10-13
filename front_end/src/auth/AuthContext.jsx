import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://127.0.0.1:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const userData = res.data?.user || null;
        try {
          const roles = JSON.parse(localStorage.getItem('roles')) || null;
          if (roles && roles.length > 0) {
            userData.role = userData.role || roles[0];
          }
        } catch (e) {}
        setUser(userData);
      })
      .catch(() => setUser(null));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
