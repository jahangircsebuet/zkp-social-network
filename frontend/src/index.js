import React from "react";
//import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import configureStore from "./store";
import { ModalProvider } from "./components/Modal";


const store = configureStore();

//ReactDOM.createRoot(
//    <React.StrictMode>
//        <Provider store={store}>
//            <ModalProvider>
//                <App />
//            </ModalProvider>
//        </Provider>
//    </React.StrictMode>,
//    document.getElementById("root")
//);

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
            <ModalProvider>
                <App />
            </ModalProvider>
        </Provider>
  </React.StrictMode>
);