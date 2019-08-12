import axios from "axios";
import store from "@/store";

const instance = axios.create({
  timeout: 15000,
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

    config.headers["content-language"] = store.state.api.locale;

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
    if (error.response.data.code && error.response.data.code === "error.user.not.found.id") {
      store.dispatch("resetAll");
    } else {
      // Do something with response error
      store.dispatch("api/setServerError", {
        serverMessage: error.response.data.message
      });
    }
    return Promise.reject(error);
  }
);

export default instance;
