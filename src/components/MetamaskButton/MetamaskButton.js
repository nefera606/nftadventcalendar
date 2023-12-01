import { useState } from 'react';
import { useSDK } from '@metamask/sdk-react';
import * as React from 'react';
import Button from '@mui/material/Button';
import { trigger } from "../../lib/events";
import { setConnection } from '../../lib/blockchainHandler'

function MetamaskButton() {
  const { sdk, connected, connecting, provider, chainId } = useSDK();

  const [account, setAccount] = useState('')

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      await setConnection(chainId,provider);
      setAccount(accounts?.[0].toString());
    } catch(err) {
      console.warn(`failed to connect..`, err);
    }
  };

  async function getAccount() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      .catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log('Please connect to MetaMask.');
        } else {
          console.error(err);
        }
      });
    const account = accounts?.[0];
    setAccount(account);
  }

  // if (status === "initializing") return (<div style={{'backgroundColor': 'white'}}>Synchronisation with MetaMask ongoing...</div>)

  // if (status === "unavailable") return (<div style={{'backgroundColor': 'white'}}>MetaMask not available</div>)

  if (!connected) return (<Button onClick={connect} variant="contained">Connect metamask</Button>)

  if (connecting) return (<div style={{'backgroundColor': 'white'}}>Connecting...</div>)

  if (connected) {
    if(chainId === '0x5' || chainId === '0x89'){
      trigger('statusChange', 'connected');
      getAccount();
      setConnection(chainId,provider);
      return (<div style={{'backgroundColor': 'white', 'padding': '5px','margin-bottom': '5px', 'borderRadius': '3px'}}>
        <p style={{'margin': '1px'}}>Connected account {account} on chain {((chainId) => {const net = {'0x5':'Goerli','0x89':'Polygon mainnet'}; return net[chainId]})(chainId)} (if you change network, you must reload web)</p>
        <p style={{'margin': '1px'}}>Goerli <a href='https://goerlifaucet.com/' target='_blanks'>faucet</a> if you need test gas</p>
        </div>)
    }
    return (<div style={{'backgroundColor': 'white'}}>Please connect to goerli for test or polygon for use</div>)
  }

  return null;
}

export { MetamaskButton };