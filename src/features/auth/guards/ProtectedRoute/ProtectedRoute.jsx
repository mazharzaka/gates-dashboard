import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./ProtectedRoute.module.scss";

export function ProtectedRoute({ children, allowedRoles }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <span className={styles.spinner} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard/gates" replace />;
  }

  return children;
}

export default ProtectedRoute;

