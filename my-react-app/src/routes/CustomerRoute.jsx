import { Navigate } from "react-router-dom";

const CustomerRoute = ({ children }) => {

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
        user?.vaiTro?.maVaiTro !== 2
    ) {

        return (
            <Navigate
                to="/admin/home"
                replace
            />
        );
    }

    return children;
};

export default CustomerRoute;
