import axios from "axios";
import store from "../../store"

let instance = axios.create({
  timeout: 1000,
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
})

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  if(store.getters['header/yonaPassword'])
    config.headers["Yona-Password"] = store.getters['header/yonaPassword']

  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {

  // Do something with response data
  if(response.data.yonaPassword) {
    store.dispatch("header/setHeaderPassword", {yonaPassword: response.data.yonaPassword});

    if(response.data._links){
      store.dispatch("links/setLinks", {links: response.data._links})
    }
  }

  return response;
}, function (error) {
  console.log(error)
  // Do something with response error
  return Promise.reject(error);
});

export default instance