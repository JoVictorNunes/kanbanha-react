import type { AuthLoader } from "@/types";

const authLoader = async (): Promise<AuthLoader> => {
  const token = localStorage.getItem("token");
  if (!token) {
    return {
      code: 400,
    };
  }
  const response = await fetch(
    `http://localhost:3000/checkAuth?token=${token}`
  );
  return {
    code: response.status as 200 | 400,
  };
};

export default authLoader;
