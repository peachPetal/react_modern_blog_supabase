import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "../../stores/authStore";

export default function PublicOnlyRoute () {
    const location = useLocation();
    const isLoading = useAuthStore(state => state.isLoading);
    const claims = useAuthStore(state => state.claims);
    if(isLoading) return null;
    if(claims) {
        const to = location.state?.from.pathname ?? "/";
        return <Navigate to={to} replace />;
    }
    return <Outlet />;
}