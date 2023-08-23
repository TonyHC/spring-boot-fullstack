import {combineReducers, configureStore} from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {persistReducer, persistStore} from "redux-persist";

import customerReducer from "./customer/CustomerSlice.tsx";
import authReducer from "./auth/AuthSlice.tsx";
import {Persistor} from "redux-persist/es/types";

const reducers = combineReducers({
    customer: customerReducer,
    auth: authReducer
});

const persistConfig = {
    key: "root",
    storage
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/PURGE"]
            }
        })
});

export const persistor: Persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;