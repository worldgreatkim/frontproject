// src/util/http-status.js
export const httpStatusCode = {
  OK: 200,
  CREATE: 201,
  NOCONTENT: 204,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOTFOUND: 404,
};

// src/util/auth.js
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