import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/userContext.jsx";
import { TodoProvider } from "./context/todoContext.jsx";

createRoot(document.getElementById("root")).render(
  <UserProvider>
    <TodoProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TodoProvider>
  </UserProvider>
);
