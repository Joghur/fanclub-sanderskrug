import { green } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { IKContext } from "imagekitio-react";
import { SnackbarProvider } from "notistack";
import React from "react";
import { render } from "react-dom";

import App from "./App";
import { imageEndpoint, imageKey } from "./config/imageKit";

const theme = createTheme({
  palette: {
    primary: {
      main: green[500],
    },
  },
});

const root = document.getElementById("root");
render(
  <ThemeProvider theme={theme}>
    <IKContext
      publicKey={imageKey}
      urlEndpoint={imageEndpoint}
      transformationPosition="path"
    >
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <App />
      </SnackbarProvider>
    </IKContext>
  </ThemeProvider>,
  root
);
