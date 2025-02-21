import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }:{children:any}) => {
  const token = sessionStorage.getItem("token");

  return token ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
