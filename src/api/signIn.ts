const { VITE_SERVER_DOMAIN, VITE_SERVER_PORT, VITE_SERVER_PROTOCOL } = import.meta.env;

const ENDPOINT = '/signIn';
const URL = `${VITE_SERVER_PROTOCOL}://${VITE_SERVER_DOMAIN}:${VITE_SERVER_PORT}${ENDPOINT}`;

export const signIn = async (email: string, password: string) => {
  const body = { email, password };
  return fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};
