import axios from "axios";

const token = localStorage.getItem("token");

export const api = axios.create({
  baseURL: "http://localhost:4000/admin",
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});
