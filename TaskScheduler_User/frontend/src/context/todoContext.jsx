import axios from "axios";
import { createContext, useState } from "react";

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]); // Initialize as an empty array

  const addTodos = async (todo) => {
    try {
      const response = await axios.post("/api/tasks/create", todo); // Properly await the response
      if (response.status === 201) {
        await getAllTodos(); // Fetch updated todos after successful creation
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.response?.data?.message || "Failed to add todos"}`);
    }
  };

  const getAllTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(response.data); // Ensure `response.data` is an array
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.response?.data?.message || "Failed to fetch todos"}`);
    }
  };

  return (
    <TodoContext.Provider value={{ todos, addTodos, getAllTodos }}>
      {children}
    </TodoContext.Provider>
  );
};
