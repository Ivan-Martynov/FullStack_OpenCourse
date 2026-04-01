import "core-js/stable/index.js";
import "regenerator-runtime/runtime.js";

import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

// const hello = (name) => console.log(`Hello, ${name}`);

createRoot(document.getElementById("root")).render(<App />);
