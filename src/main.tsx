import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style/index.css";
import App from "./App.tsx";
import { client } from "./lib/appwrite";

client
  .ping()
  .then((response) => {
    console.log("Appwrite startup ping response:", response);
  })
  .catch((error) => {
    console.error("Appwrite startup ping error:", error);
  });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
