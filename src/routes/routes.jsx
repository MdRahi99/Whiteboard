import { createBrowserRouter } from "react-router-dom";
import Drawings from "../pages/Drawings/Drawings";
import Error from "../components/shared/Error/Error";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Drawings />,
        children: [
            {
                path: "/",
                element: <Drawings />,
            },
        ],
    },
    {
        path: "*",
        element: <Error />
    }
]);