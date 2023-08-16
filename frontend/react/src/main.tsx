import ReactDOM from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {StyledEngineProvider} from "@mui/material/styles";
import "./index.css";
import App from "./App";
import {persistor, store} from "./store/Store.tsx";
import {SnackbarProvider} from "notistack";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <BrowserRouter>
                <StyledEngineProvider injectFirst>
                    <SnackbarProvider maxSnack={3}>
                        <App/>
                    </SnackbarProvider>
                </StyledEngineProvider>
            </BrowserRouter>
        </PersistGate>
    </Provider>
);