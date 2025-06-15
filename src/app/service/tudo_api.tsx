import { baseURL } from "../config/baseURL";
import { AxiosError } from "axios";
const getTodo = async () => {
  try {
    const response = await baseURL.get("/todo/list");
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError;
    throw err.response?.data || err.message;
  }
};

const getByID = async (id: number) => {
  try {
    const response = await baseURL.get(`/todo/show/${id}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError;
    throw err.response?.data || err.message;
  }
};

const createTodo = async (todo: { todo: string }) => {
  try {
    const response = await baseURL.post("/todo/create", todo);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError;
    console.log(err.response?.data);
  }
};

const updateTodo = async (id: number, data: { todo: string }) => {
  try {
    const response = await baseURL.put(`/todo/update/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError;
    console.log(err.response?.data);
  }
};

const updateStatus = async (id: number) => {
  try {
    const response = await baseURL.put(`/todo/update_status/${id}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError;
    console.log(err.response?.data);
  }
};

const deleteTodo = async (id: number) => {
  try {
    const response = await baseURL.delete(`/todo/delete/${id}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError;
     console.log (err.response?.data);
  }
};
export { getTodo, createTodo, updateTodo, updateStatus, deleteTodo, getByID };
