import { useState } from "react"; 
import { login as loginService } from "../Services/UserService";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../App";
import React from 'react';
import './Login.css'; // אם תרצה להוסיף עיצוב חיצוני

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginService({ email, password });
      login(res.id);
      navigate('/bot');
    } catch (err: any) {
      setMessage("אימייל או סיסמה שגויים");
    }
  };

  return (
    <>
<header style={{ padding: "5px", backgroundColor: "#f0f0f0", textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }}>
אפליקצית צייר עם בוט🖌️      </header> 
    <form onSubmit={handleLogin} style={{ maxWidth: 320, margin: 'auto', padding: 20, boxShadow: '0 0 10px #82c0cc', borderRadius: 12 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>התחברות</h2>
      <input
        type="email"
        placeholder="אימייל"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ width: '100%', padding: 10, marginBottom: 15, borderRadius: 6, border: '1px solid #82c0cc' }}
      />
      <input
        type="password"
        placeholder="סיסמה"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ width: '100%', padding: 10, marginBottom: 15, borderRadius: 6, border: '1px solid #82c0cc' }}
      />
      <button
        type="submit"
        style={{ width: '100%', padding: 10, backgroundColor: '#82c0cc', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
      >
        התחבר
      </button>
      {message && <p style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>{message}</p>}

      <p style={{ marginTop: 20, textAlign: 'center' }}>
        עוד לא נרשמת?{' '}
        <Link to="/register" style={{ color: '#053d48ff', textDecoration: 'underline' }}>
          עבור להרשמה
        </Link>
      </p>
      
    </form>
    </>
  );
}