import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { AppRole } from "@/contexts/AuthContext";
import { PATHS } from "./paths";

interface Props {
  requiredRole?: AppRole;
}

const ROLE_HIERARCHY: Record<AppRole, number> = {
  user: 1,
  staff: 2,
  admin: 3,
  super_admin: 4,
};

export default function ProtectedRoute({ requiredRole = "user" }: Props) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-32">
        <span className="material-symbols-outlined text-4xl text-primary-container animate-spin">
          progress_activity
        </span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  if (!role || ROLE_HIERARCHY[role] < ROLE_HIERARCHY[requiredRole]) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  return <Outlet />;
}
