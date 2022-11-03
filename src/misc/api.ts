import axios from "axios";

export const baseURL: string = "http://[::1]:5000";

export default axios.create({
  baseURL,
});
