import axios from "axios";
import * as Utilities from "./Utilities";
import { API } from "./Constants";

const axiosInstance = axios.create();

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await Utilities.getUserToken();
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token expired & not already trying to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      //   try {
      //     const refreshToken = await Utilities.getRefreshToken();
      //     const res = await axios.post(API.EndPoint.REFRESH_TOKEN, {
      //       refresh_token: refreshToken,
      //     });

      //     const newToken = res.data.access_token;
      //     await Utilities.setUserToken(newToken);
      //     axiosInstance.defaults.headers.common["Authorization"] = newToken;
      //     processQueue(null, newToken);

      //     return axiosInstance(originalRequest);
      //   } catch (err) {
      //     processQueue(err, null);
      //     return Promise.reject(err);
      //   } finally {
      //     isRefreshing = false;
      //   }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
