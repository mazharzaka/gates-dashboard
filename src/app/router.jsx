import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage, ProtectedRoute } from "../features/auth/index.js";
import DashboardPage from "../features/dashboard/pages/DashboardPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <Navigate to="/dashboard/gates" replace />,
  },
  {
    path: "/dashboard/gates",
    element: (
      <ProtectedRoute allowedRoles={["guard", "admin"]}>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/log",
    element: (
      <ProtectedRoute allowedRoles={["guard", "admin"]}>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);
