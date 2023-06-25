import React, { SyntheticEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const email = formData.get("email");
    const password = formData.get("password");
    const response = await fetch("http://localhost:3000/signIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    if (response.status === 201) {
      const body = await response.json();
      const { token } = body;
      localStorage.setItem("token", token);
      navigate("/");
    }
    if (response.status === 400) {
      setError("Não foi possível fazer login.");
    }
  };
  return (
    <div>
      <form onSubmit={onSubmit} ref={formRef}>
        <input type="email" name="email" required />
        <input type="password" name="password" required />
        <div>{error ? error : " "}</div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;
