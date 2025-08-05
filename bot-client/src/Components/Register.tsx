import { useState } from "react";
import { register } from "../Services/UserService";
import { useNavigate } from "react-router-dom";
import React from 'react';
import './Login.css';

export default function Register() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form);
      setForm({ fullName: "", email: "", password: "" });
      navigate("/login");
    } catch (err: any) {
      setMessage(`שגיאה ברישום: ${err.message || err}`);
    }
  };

  return (
    <>
    <header style={{ padding: "5px", backgroundColor: "#f0f0f0", textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }}>
אפליקצית צייר עם בוט🖌️      </header> 
    <form onSubmit={handleSubmit} className="register-form">
      <h2>רישום</h2>
      <input
        type="text"
        placeholder="שם מלא"
        value={form.fullName}
        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        required
        autoComplete="name"
      />
      <input
        type="email"
        placeholder="אימייל"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
        autoComplete="email"
      />
      <input
        type="password"
        placeholder="סיסמה"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
        autoComplete="new-password"
      />
      <button type="submit">הרשם</button>
      {message && <p className="error-message">{message}</p>}
    </form>
    </>
  );
}
