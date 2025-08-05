import React, { useState, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DrawingBot from "./Components/DrawingBot";
import Login from "./Components/Login";
import Register from "./Components/Register";

// יצירת הקשר למשתמש מחובר
const AuthContext = createContext<{
  userId: number | null;
  login: (id: number) => void;
  logout: () => void;
}>({
  userId: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

const App: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(() => {
    const savedId = localStorage.getItem("userId");
    return savedId ? Number(savedId) : null;
  });

  const login = (id: number) => {
    setUserId(id);
    localStorage.setItem("userId", String(id));
  };

  const logout = () => {
    setUserId(null);
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout }}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/bot" element={userId ? <DrawingBot /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
