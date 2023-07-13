import {CssBaseline} from "@mui/material";
import RouterRoutes from "./routes/Routes.tsx";
import Layout from "./components/content/Layout";

const App = () => {
    return (
        <Layout>
            <CssBaseline/>
            <RouterRoutes/>
        </Layout>
    );
};

export default App;