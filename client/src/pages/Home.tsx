import { Navigate, Outlet, useNavigate } from "react-router-dom";

export const Home = () => {
    const navigate = useNavigate();

    if (localStorage.getItem("token")) {
        return <Navigate replace to="/dashboard" />
    } else {
        return (
            <div>
                <h1>Reptile Manager</h1>
                <h2>A web application that allows users to track their reptiles and their care</h2>
                <button onClick={() => navigate("./login", {replace: false})}>Login</button>
                <button onClick={() => navigate("./signup", {replace: false})}>Signup</button>
            </div>
        );
    }
}