import { useMetaMask } from "metamask-react";
import * as React from 'react';
import Button from '@mui/material/Button';
import { trigger } from "../../lib/events";

function MetamaskButton() {

  
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  

  if (status === "initializing") return (<div div style={{'backgroundColor': 'white'}}>Synchronisation with MetaMask ongoing...</div>)

  if (status === "unavailable") return (<div div style={{'backgroundColor': 'white'}}>MetaMask not available</div>)

  if (status === "notConnected") return (<Button onClick={connect} variant="contained">Connect metamask</Button>)

  if (status === "connecting") return (<div style={{'backgroundColor': 'white'}}>Connecting...</div>)

  if (status === "connected") {
    if(chainId == '0x5'){
      trigger('statusChange', status)
      return (<div style={{'backgroundColor': 'white'}}>Connected account {account} on chain ID {chainId}</div>)
    }
    return (<div style={{'backgroundColor': 'white'}}>Please connect to goerli</div>)
  }

  return null;
}

export { MetamaskButton };