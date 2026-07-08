import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const BoarderRoute = () => {
  const { user, token, isLoading } = useAuth();

  if (isLoading) return null;

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.user_type !== "Boarder") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default BoarderRoute;