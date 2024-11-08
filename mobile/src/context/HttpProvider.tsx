import axios from "axios";
import { HttpContext } from "./Context";

const __baseURL = import.meta.env.VITE_BASE;
const __path = import.meta.env.VITE_PATH;
const api = axios.create({
  baseURL: __baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
function HttpProvider({ children }) {
  api.interceptors.request.use(
    async (config) => {
      const token = localStorage.getItem("accessToken");
      const pin = sessionStorage.getItem("pin");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers['x-sign-pin'] = `${pin}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      return Promise.reject(error);
    }
  );

  const __export = {
    Post: async (path: string, data: object) => {
      return api.post(__path + path, data);
    },
    Get: async (path: string) => {
      return api.get(__path + path);
    },

    Put: async (path: string, data: object) => {
      return api.put(__path + path, data);
    },

    Patch: async (path: string) => {
      return api.patch(__path + path);
    },

    Delete: async (path: string, data: object) => {
      return api.delete(__baseURL + __path + path, {
        data: data,
      });
    },

    Picture: async (path: string) => {
      const response = await fetch(__baseURL + path);
      const blob = await response.blob();
      return blob;
    },
    ErrorResponse: (error: any) => error.response?.data.system_response.message  || "Internal Server Error",
    MessageResponse: (response: any) => response?.data.system_response.message || "Internal Server Error",
  };

  return <HttpContext.Provider value={__export}>{children}</HttpContext.Provider>;
}

export default HttpProvider;
