import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard.tsx";
import AppLayout from "../pages/AppLayout/AppLayout.tsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            { index: true, element: <Dashboard/>},
        ],
    },
]);
export default router
