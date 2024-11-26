import axios from "axios";

const API_URL = "http://localhost:8081/products";

export const getProducts = (page: number, limit: number) =>
  axios.get(`${API_URL}?page=${page}&limit=${limit}`);
export const getProduct = (id: number) => axios.get(`${API_URL}/${id}`);
export const updateProduct = (id: number, data: any) =>
  axios.patch(`${API_URL}/${id}`, data);
