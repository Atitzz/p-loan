import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./css/index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { BrowserRouter } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import HttpProvider from "./context/HttpProvider.tsx";
import ToolsProvider from "./context/ToolsProvider.tsx";
import ContextProvider from "./context/ContextProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <BrowserRouter>
      <HttpProvider>
        <ToolsProvider>
          <ContextProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="TH">
              <App />
            </LocalizationProvider>
          </ContextProvider>
        </ToolsProvider>
      </HttpProvider>
    </BrowserRouter>
  // </React.StrictMode>
);
