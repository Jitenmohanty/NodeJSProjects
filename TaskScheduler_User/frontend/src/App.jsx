import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import AdminAddUser from "./components/AdminAddUser";
import Header from "./components/Header";

function App() {
  return (
    <>
    <Header/>
        <Routes>
          <Route path="/" element={<>Home Page</>} />
          <Route path="/admin" element={<AdminAddUser />} />
        </Routes>
    </>
  );
}

export default App;
