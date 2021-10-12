import * as React from "react";
import ReactDOM from "react-dom";
import { StyledEngineProvider } from "@mui/material/styles";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Todo from "./todo";

ReactDOM.render(
  <div style={{ height: "100vh" }}>
    <StyledEngineProvider injectFirst>
      <Todo />
    </StyledEngineProvider>
  </div>,
  document.querySelector("#root")
);
