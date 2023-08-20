const { VITE_SERVER_DOMAIN, VITE_SERVER_PORT, VITE_SERVER_PROTOCOL } = import.meta.env;

const ENDPOINT = '/checkAuth';
const URL = `${VITE_SERVER_PROTOCOL}://${VITE_SERVER_DOMAIN}:${VITE_SERVER_PORT}${ENDPOINT}`;

export const checkAuth = async (token: string) => {
  const params = new URLSearchParams([['token', token]]);
  return fetch(`${URL}?${encodeURI(params.toString())}`);
};
