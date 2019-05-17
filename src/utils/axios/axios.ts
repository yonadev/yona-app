import axios from "axios";

export default axios.create({
  baseURL: 'http://192.168.1.9:8082',
  timeout: 1000,
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
})