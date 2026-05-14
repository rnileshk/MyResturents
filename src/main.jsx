import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        toastOptions={{
          duration: 3000,

          style: {
            background: "#0f172a",
            color: "#ffffff",
            borderRadius: "18px",
            padding: "14px 18px",
            fontWeight: "600",
            boxShadow:
              "0 10px 40px rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.08)",
          },

          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#ffffff",
            },
          },

          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />

      <App />
    </BrowserRouter>
  </React.StrictMode>
);