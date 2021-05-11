import axios from "axios";
import { compute_rest_props } from "svelte/internal";
import { writable } from "svelte/store";

const currentUser = writable(null);

const loginEP = "/identity/login";
const refreshTokenEP = "/identity/refresh-token";
const axiosAPI = axios.create({
  baseURL: "https://localhost:5001",
});
let refreshingToken = false;
let loggingIn = false;
let bearerToken = null;

axiosAPI.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const origReq = err.config;
    if (
      (err.response.status === 403 || err.response.status === 401) &&
      !refreshingToken && !loggingIn
    ) {
      refreshingToken = true;
      const newUserData = await refreshToken();
      if(newUserData?.data?.token) {
        bearerToken = newUserData.data.token;
        currentUser.set(newUserData.data)
        setAuthorizationLocalStorage(newUserData.data);
        origReq.headers.Authorization = `Bearer ${bearerToken}`;
        return axiosAPI(origReq);
      } else {

      }
      refreshingToken = false;
    }
    return Promise.reject(err);
  }
);

const apiRequest = (method, url, request) => {
  const userData = getAuthorizationLocalStorage();
  const headers = {};
  if (!!userData?.token) {
    headers.Authorization = `Bearer ${bearerToken}`;
  }
  return axiosAPI({
    method,
    url,
    data: request,
    headers,
  })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

const login = async (userName, password, tenant) => {
  loggingIn = true;
  const userData = await axiosAPI.post(loginEP, {
    userName,
    password,
    tenant
  });
  loggingIn = false;
  setAuthorizationLocalStorage(userData.data);
  currentUser.set(userData.data);
};

const refreshToken = async () => {
  return axiosAPI.post(refreshTokenEP, {
    oldToken: bearerToken
  });
};

const getAuthorizationLocalStorage = () => {
  const localUserData = window.localStorage.getItem("lab-calculator-token");
  if (typeof localUserData !== 'undefined' && localUserData !== null) {
    return JSON.parse(localUserData);
  } else {
    return null;
  }
};

const setAuthorizationLocalStorage = (userData) => {
  bearerToken = userData.token;
  window.localStorage.setItem("lab-calculator-token", JSON.stringify(userData));
};

const readAndSetUser = () => {
  const localUserData = getAuthorizationLocalStorage();
  if(localUserData != null) {
    currentUser.set(localUserData);
    bearerToken = localUserData.token;
  } else {
    currentUser.set(null);
    bearerToken = null;
  }
};

const logout = () => {
  bearerToken = null;
  window.localStorage.clear("lab-calculator-token");
  currentUser.set(null);
}

const getRequest = (url, request) => apiRequest("get", url, request);
const deleteRequest = (url, request) => apiRequest("delete", url, request);
const postRequest = (url, request) => apiRequest("post", url, request);
const putRequest = (url, request) => apiRequest("put", url, request);
const patchRequest = (url, request) => apiRequest("patch", url, request);

const API = {
  get: getRequest,
  delete: deleteRequest,
  post: postRequest,
  put: putRequest,
  patch: patchRequest,
  login,
  refreshToken,
  logout,
  readAndSetUser,
  currentUser
};
export default API;
