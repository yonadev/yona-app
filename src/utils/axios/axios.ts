import axios from "axios";
import store from "@/store";

const instance = axios.create({
  timeout: 1000,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
  }
});

// Add a request interceptor
instance.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters["api/yonaPassword"]) {
      config.headers["Yona-Password"] = store.getters["api/yonaPassword"];
    }

    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  response => {
    // Do something with response data
    if (response.data.yonaPassword) {
      store.dispatch("api/setHeaderPassword", {
        yonaPassword: response.data.yonaPassword
      });

      if (response.data._links) {
        store.dispatch("api/setLinks", { links: response.data._links });
      }

      if (response.data._embedded) {
        store.dispatch("api/setEmbedded", {
          embedded: response.data._embedded
        });
      }
    }

    return response;
  },
  error => {
    // Do something with response error
    return Promise.reject(error);
  }
);

export default instance;
