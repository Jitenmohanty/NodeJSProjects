import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useContext, useEffect } from "react";
import { UserContext } from "./context/userContext";
import Dashboard from "./components/Dashboard";

function App() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(()=>{
    if(user){
      navigate("/")
    }else{
      navigate("/login")
    }
  },[user])
  return (
    <>
      <Header />
      <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        {
          user && <Route path="/" element={<Dashboard />} />
        }
      </Routes>
    </>
  );
}

export default App;
