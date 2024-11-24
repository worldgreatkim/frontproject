import axios from "axios";
import { httpStatusCode } from "./http-status";
import { getToken, TOKEN_TYPE } from "./auth";
import router from "@/router";

const API_BASE_URL = import.meta.env?.VITE_VUE_API_URL || 'http://localhost:8080';

function localAxios() {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  instance.interceptors.request.use(
    (config) => {
      const token = getToken(TOKEN_TYPE.ACCESS);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === httpStatusCode.UNAUTHORIZED && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = getToken(TOKEN_TYPE.REFRESH);
          const response = await instance.post("/user/refresh", { refreshToken });

          if (response.data.result?.accessToken) {
            const newAccessToken = response.data.result.accessToken;
            sessionStorage.setItem("accessToken", newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return instance(originalRequest);
          }
        } catch (refreshError) {
          router.push({ name: "login" });
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

export { localAxios };