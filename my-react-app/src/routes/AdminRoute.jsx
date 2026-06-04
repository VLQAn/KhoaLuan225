import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {

    const userData =
        localStorage.getItem("user");

    if (!userData) {

        return (
            <Navigate
                to="/register"
                replace
            />
        );
    }

    const user =
        JSON.parse(userData);

    if (
        user?.vaiTro?.maVaiTro !== 1
    ) {

        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return children;
};

export default AdminRoute;
