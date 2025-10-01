import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5000/api", // adjust if needed
  headers: { "Content-Type": "application/json" },
});