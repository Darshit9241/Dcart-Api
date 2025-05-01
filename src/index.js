import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
// import store from './redux/store';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { ApiProvider } from './context/ApiContext';


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <PersistGate loading={null} persistor={persistor}>
          <ApiProvider>
            <App />
          </ApiProvider>
        </PersistGate>
      </BrowserRouter>
    </React.StrictMode>
  </Provider>,
);

reportWebVitals();
