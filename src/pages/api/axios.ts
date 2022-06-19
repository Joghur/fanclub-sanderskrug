import axios from "axios";

export const apiFetch = (url: string): any => {
  return axios.get(url);
};
