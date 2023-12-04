import Web3 from "web3";
import axios from 'axios';
import { trigger } from "./events";
import {
  abi
} from './abi';

let chainId;

const setConnection = (id, _provider) => {
  chainId = id;
}

const NftAddress = {
  '0x5': '0x55d697Bd04B4B021872E6e53964d2Bd2084f2B91',
  '0x89': '0x18f808e072d09bEE48429C3504e452d6AfFb50ee'
}


const loadBlockChain = async (setData, nftRound) => {
  try{
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const nft = new web3.eth.Contract(abi, NftAddress[chainId]);
    const nftBalance = await nft.methods.balanceOf(accounts[0]).call()
    const nftRounds = await nft.methods.rounds().call()
    const roundInfo = await nft.methods.roundInfo(nftRound).call();
    const amount_n = roundInfo['0']
    const amount_e = roundInfo['1']
    const amount_p = roundInfo['2']
    const nftDailySupply = Number(amount_n) + Number(amount_e) + Number(amount_p);
    setData({
      Balance: web3.utils.toNumber(nftBalance),
      Total: web3.utils.toNumber(nftRounds),
      DailySupply: nftDailySupply,
      NSupply: web3.utils.toNumber(amount_n),
      ESupply: web3.utils.toNumber(amount_e),
      GSupply: web3.utils.toNumber(amount_p)
    });
  } catch(e) {
    window.alert(e.error.message)
  }
}

const claimed = async (round) => {
  const web3 = new Web3(window.ethereum);
  const nft = new web3.eth.Contract(abi, NftAddress[chainId]);
  const accounts = await web3.eth.getAccounts();
  const claimed = await nft.methods.hasClaimed(round,accounts[0]).call()
  const borderCondition = await nft.methods.ownerOf(0).call();
  if(round === 0 && accounts[0] === borderCondition) {
    return true;
  }
  return claimed;
}

const getBorder = async (round) => {
 const web3 = new Web3(window.ethereum);
 const nft = new web3.eth.Contract(abi, NftAddress[chainId]);
  const accounts = await web3.eth.getAccounts();
  const tokenId = await nft.methods.claimedPerRound(round, accounts[0]).call()
  const border = await nft.methods.borderToken(tokenId).call()
  return border;
}

const claim = async (round) => {
  const web3 = new Web3(window.ethereum);
  const nft = new web3.eth.Contract(abi, NftAddress[chainId]);
  const accounts = await web3.eth.getAccounts();
  console.log(`${round}`)
  try {
    await nft.methods.claim(web3.utils.toBigInt(`${round}`)).send({
      from: accounts[0],
      data: nft.methods.claim(web3.utils.toBigInt(`${round}`)).encodeABI()
    })
    .on('receipt', async (receipt) => {
      const tokenId = await nft.methods.claimedPerRound(round, accounts[0]).call()
      trigger('claimed', tokenId);
    });
  } catch(e) {
    console.log(e.error.message)
    throw new Error(e.error.message);
  }
}

const getTokenUri = async (index) => {
  try {
    const web3 = new Web3(window.ethereum);
    const nft = new web3.eth.Contract(abi, NftAddress[chainId]);
    const uri = await nft.methods.tokenURI(index).call()
    console.log(`Token uri ${uri}`)
    let jsonData
    let response = await axios.get(uri);
    jsonData = response.data;
    return jsonData;
  } catch(e) {
    console.log('ERROR in getTokenUri')
    console.log(e)
    throw new Error(e.error.message);
  }
}

const claimedPerRound = async (round) => {
  try {
    const web3 = new Web3(window.ethereum);
    const nft = new web3.eth.Contract(abi, NftAddress[chainId]);
    const accounts = await web3.eth.getAccounts();
    const index = await nft.methods.claimedPerRound(round, accounts[0]).call()
    return web3.utils.toNumber(index);
  } catch(e) {
    console.log('ERROR in claimedPerRound')
    console.log(e)
    throw new Error(e.error.message);
  }
}



export {
  setConnection,
  loadBlockChain,
  getBorder,
  claimed,
  claim,
  getTokenUri,
  claimedPerRound
};