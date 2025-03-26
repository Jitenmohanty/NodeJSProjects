import { useSearchParams } from "react-router-dom";
import LoginForm from "../pages/LoginForm";
import RegisterForm from "../pages/RegisterForm";
import Header from "./Header";
import { useTheme } from "../context/ThemeContex";

const AuthComponent = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "login";
  const {darkMode} = useTheme();

  return (
    <div className={`min-h-screen ${ darkMode
      ? "bg-gray-700 shadow-gray-500/50"
      : "bg-white shadow-gray-200/50"
  } transition-colors duration-200 `}>
      <Header/>
      {mode === "login" ? <LoginForm /> : <RegisterForm />}
    
    </div>
  );
};

export default AuthComponent;