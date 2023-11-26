import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './views/App';
import { MetaMaskProvider } from '@metamask/sdk-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MetaMaskProvider debug={false} sdkOptions={{
    checkInstallationImmediately: false,
    dappMetadata: {
      name: "Nft Advent Calendar React App",
      url: window.location.host,
    }
  }}>
    <App />
  </MetaMaskProvider>
);


