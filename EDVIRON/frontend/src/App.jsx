import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import TransactionsPage from "./pages/TransactionsPage";
import TransactionDetailsPage from "./pages/TransactionDetailsPage";
import StatusCheckPage from "./pages/StatusCheckPage";
import Navbar from "./components/Navbar";
import WebhookUI from "./components/WebhookUI";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { UserContext } from "./context/userContext";

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {user && (
            <>
              <Route path="/" element={<TransactionsPage />} />
              <Route path="/details" element={<TransactionDetailsPage />} />
              <Route path="/status" element={<StatusCheckPage />} />
            </>
          )}
        </Routes>
        <WebhookUI />
      </div>
    </>
  );
};

export default App;
