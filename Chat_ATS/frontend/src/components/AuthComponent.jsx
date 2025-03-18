import React, { useState } from "react";
import LoginForm from "../pages/LoginForm";
import RegisterForm from "../pages/RegisterForm.jsx";

const AuthComponent = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh]">
      {isRegistering ? (
        <RegisterForm switchToLogin={() => setIsRegistering(false)} />
      ) : (
        <LoginForm switchToRegister={() => setIsRegistering(true)} />
      )}
    </div>
  );
};

export default AuthComponent;