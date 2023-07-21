import {CssBaseline} from "@mui/material";
import RouterRoutes from "./routes/Routes.tsx";
import Layout from "./components/shared/Layout.tsx";

const App = () => {
    return (
        <Layout>
            <CssBaseline/>
            <RouterRoutes/>
        </Layout>
    );
};

export default App;