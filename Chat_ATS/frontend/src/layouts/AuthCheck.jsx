import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import MainLayout from "./MainLayout";
import AuthLayout from "./AuthLayout";

const AuthCheck = ({ authenticated, unauthenticated }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (user) {
    return <MainLayout>{authenticated}</MainLayout>;
  }

  return <AuthLayout>{unauthenticated}</AuthLayout>;
};

export default AuthCheck;