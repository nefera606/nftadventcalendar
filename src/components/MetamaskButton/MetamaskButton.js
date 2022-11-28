import { useMetaMask } from "metamask-react";
import * as React from 'react';
import Button from '@mui/material/Button';
import { trigger } from "../../lib/events";
import { setChainId } from '../../lib/blockchainHandler'

function MetamaskButton() {

  
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  

  if (status === "initializing") return (<div div style={{'backgroundColor': 'white'}}>Synchronisation with MetaMask ongoing...</div>)

  if (status === "unavailable") return (<div div style={{'backgroundColor': 'white'}}>MetaMask not available</div>)

  if (status === "notConnected") return (<Button onClick={connect} variant="contained">Connect metamask</Button>)

  if (status === "connecting") return (<div style={{'backgroundColor': 'white'}}>Connecting...</div>)

  if (status === "connected") {
    if(chainId == '0x5' || chainId == '0x89'){
      trigger('statusChange', status);
      setChainId(chainId);
      return (<div style={{'backgroundColor': 'white'}}>
        <p>Connected account {account} on chain ID {chainId} (if you change network, you must reload web)</p>
        <p>Goerli <a href='https://goerlifaucet.com/'>faucet</a> if you need test gas</p>
        </div>)
    }
    return (<div style={{'backgroundColor': 'white'}}>Please connect to goerli for test or polygon for use</div>)
  }

  return null;
}

export { MetamaskButton };