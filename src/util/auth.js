export const TOKEN_TYPE = {
  ACCESS: 'accessToken',
  REFRESH: 'refreshToken'
};

export const getToken = (type) => {
  return sessionStorage.getItem(type);
};

export const setToken = (type, token) => {
  sessionStorage.setItem(type, token);
};

export const removeToken = (type) => {
  sessionStorage.removeItem(type);
};

export const removeAllTokens = () => {
  removeToken(TOKEN_TYPE.ACCESS);
  removeToken(TOKEN_TYPE.REFRESH);
};