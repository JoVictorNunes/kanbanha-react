const { VITE_SERVER_DOMAIN, VITE_SERVER_PORT, VITE_SERVER_PROTOCOL } = import.meta.env;

const ENDPOINT = '/signUp';
const URL = `${VITE_SERVER_PROTOCOL}://${VITE_SERVER_DOMAIN}:${VITE_SERVER_PORT}${ENDPOINT}`;

export const signUp = async (email: string, name: string, role: string, password: string) => {
  const body = { email, name, role, password };
  return fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};
