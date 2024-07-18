import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";

const Route = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <div>Home</div>,
            },
        ],
    },
]);

export default Route;