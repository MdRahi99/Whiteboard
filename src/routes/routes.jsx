import { createBrowserRouter } from "react-router-dom";
import Drawings from "../pages/Drawings/Drawings";
import NotFound from "../components/shared/NotFound/NotFound";
import DrawingDetails from "../components/DrawingDetails/DrawingDetails";
import Main from "../layout/Main";
import AddDrawings from "../pages/Drawings/AddDrawings";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        children: [
            {
                path: "/",
                element: <Drawings />,
            },
            {
                path: "/drawings/:id",
                element: <DrawingDetails />,
            },
            {
                path: "/add-drawings",
                element: <AddDrawings />,
            },
        ]
    },
    {
        path: "*",
        element: <NotFound />
    }
]);