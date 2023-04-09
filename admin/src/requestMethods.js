import axios from "axios";

const BASE_URL = "http://localhost:5000/api/";
const TOKEN = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { token: `Bearer ${TOKEN}` },
});

//{"user":"{\"currentUser\":null,\"isFetching\":false,\"error\":false}","cart":"{\"products\":[],\"quantity\":0,\"total\":0}","_persist":"{\"version\":1,\"rehydrated\":true}"}
// const res = await publicRequest.get("/");
//   console.log(res);
//   console.log(res.data);