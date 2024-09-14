import { createBrowserRouter } from "react-router-dom";
import Drawings from "../pages/Drawings/Drawings";
import NotFound from "../components/shared/NotFound/NotFound";

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
        element: <NotFound />
    }
]);