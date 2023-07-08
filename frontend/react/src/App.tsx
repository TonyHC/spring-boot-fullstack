import {
    CssBaseline,
} from "@mui/material";

import ReactRouterRoutes from "./routes";
import Layout from "./components/content/Layout";

const App = () => {
    return (
        <Layout>
            <CssBaseline />
            <ReactRouterRoutes />
        </Layout>
    );
};

export default App;