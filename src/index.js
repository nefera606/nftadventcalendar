import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './views/App';
import { MetaMaskProvider } from "metamask-react";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MetaMaskProvider>
    <App />
  </MetaMaskProvider>
);


