import axios from "axios";

export const makeRequest = axios.create({
      //used to make it easier to call the server
      baseURL: 'http://localhost:3001/api/',
      withCredentials: true,
})