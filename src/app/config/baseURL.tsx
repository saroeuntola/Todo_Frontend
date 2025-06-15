import axios from "axios";
export const baseURL = axios.create({
  baseURL: "http://3.0.120.140:8080/api",
});
