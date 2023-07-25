import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Pages/App.tsx';
import './main.css';
import "@melloware/coloris/dist/coloris.css";
import Coloris from "@melloware/coloris";

Coloris.init();
Coloris({
  el: "#coloris",
  alpha: false
});

// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
