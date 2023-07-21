import React, { SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
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
    <div className="h-full flex flex-col gap-4 items-center justify-center">
      <h1 className="text-left text-2xl">Sign In</h1>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
      >
        <input
          type="email"
          name="email"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="border-[1px] border-black rounded-3xl outline-none focus:shadow-[0px_0px_0px_2px] py-2 px-4 focus:shadow-blue-600 focus:border-blue-600"
        />
        <input
          type="password"
          name="password"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          className="border-[1px] border-black rounded-3xl outline-none focus:shadow-[0px_0px_0px_2px] py-2 px-4 focus:shadow-blue-600 focus:border-blue-600"
        />
        <div>{error}</div>
        <button
          type="submit"
          className="rounded-3xl bg-blue-600 text-white py-2 px-4 hover:bg-blue-700 active:scale-[0.95] transition-all"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
