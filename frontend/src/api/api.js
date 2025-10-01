import axios from "axios";

export default axios.create({
  baseURL: "https://koll-trading.vercel.app", // adjust if needed
  headers: { "Content-Type": "application/json" },
});