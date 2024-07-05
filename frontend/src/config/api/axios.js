import axios from "axios";
// Define the base URL for API requests
const baseURL = "http://localhost:3500";

// Create an Axios instance with the specified base URL and content type header
export default axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
});
