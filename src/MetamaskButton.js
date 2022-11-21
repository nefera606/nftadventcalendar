import { useMetaMask } from "metamask-react";
import * as React from 'react';
import Button from '@mui/material/Button';

function MetamaskButton() {

  const { status, connect, account, chainId, ethereum } = useMetaMask();

  if (status === "initializing") return (<div>Synchronisation with MetaMask ongoing...</div>)

  if (status === "unavailable") return (<div>MetaMask not available</div>)

  if (status === "notConnected") return (<Button onClick={connect} variant="contained">Connect metamask</Button>)

  if (status === "connecting") return (<div>Connecting...</div>)

  if (status === "connected") return (<div>Connected account {account} on chain ID {chainId}</div>)

  return null;
}

export { MetamaskButton };