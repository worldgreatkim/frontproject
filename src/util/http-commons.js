// src/util/http-commons.js
import axios from "axios";
import { httpStatusCode } from "./http-status";
import { getToken, TOKEN_TYPE } from "./auth";
import router from "@/router";

const { VITE_VUE_API_URL } = import.meta.env;

function localAxios() {
  const instance = axios.create({
    baseURL: VITE_VUE_API_URL,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  // Request Interceptor
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

  // Response Interceptor
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error.response?.status === httpStatusCode.UNAUTHORIZED) {
        // Token expired
        router.push({ name: "login" });
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

export { localAxios };