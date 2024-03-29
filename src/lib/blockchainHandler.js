import Web3 from "web3";
import { trigger } from "../lib/events";
import {
  abi
} from './abi';

let chainId;

const setConnection = (id, _provider) => {
  chainId = id;
}

const NftAddress = {
  '0x5': '0x55d697Bd04B4B021872E6e53964d2Bd2084f2B91',
  '0x89': '0x0475A405b646692a2E13397062a93B8896412eB1'
}


const loadBlockChain = async (setData, nftRound) => {
  try{
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const nft = new web3.eth.Contract(abi, NftAddress[chainId]);
    const nftBalance = await nft.methods.balanceOf(accounts[0]).call()
    const nftRounds = await nft.methods.rounds().call()
    const roundInfo = await nft.methods.roundInfo(nftRound).call();
    console.log(roundInfo);
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

const canClaim = async (_round) => {
  let round;
 const web3 = new Web3(window.ethereum);
 const nft = new web3.eth.Contract(abi, NftAddress[chainId]);
  if(!_round){
    round = await nft.methods.rounds().call();
    round = 2
  } else {
    round = _round;
  }
  const accounts = await web3.eth.getAccounts();
  const canClaim = await nft.methods.hasClaimed(round,accounts[0]).call()
  return canClaim;
}

const getBorder = async (round) => {
 const web3 = new Web3(window.ethereum);
 const nft = new web3.eth.Contract(abi, NftAddress[chainId]);
  const accounts = await web3.eth.getAccounts();
  const tokenId = await nft.methods.claimedPerRound(round, accounts[0]).call()
  const border = await nft.methods.borderToken(tokenId).call()
  return border;
}

const claim = async (setData, round) => {
  const web3 = new Web3(window.ethereum);
  const nft = new web3.eth.Contract(abi, NftAddress[chainId]);
  const accounts = await web3.eth.getAccounts();
  try {
    await nft.methods.claim(web3.utils.toBigInt(`${round}`)).send({
      from: accounts[0],
      data: nft.methods.claim(web3.utils.toBigInt(`${round}`)).encodeABI()
    })
    .on('receipt', (receipt) => {
      setData(false)
    });
  } catch(e) {
    console.log(e.error.message)
    throw new Error(e.error.message);
  }
}

const getRoundUri = async (round) => {
  const web3 = new Web3(window.ethereum);
  const nft = new web3.eth.Contract(abi, NftAddress[chainId]);
  //const accounts = await web3.eth.getAccounts();
  //const roundId = await nft.methods.claimedPerRound(round, accounts[0]).call()
  const uri = await nft.methods.roundURI(round).call()
  return uri;
}



export {
  setConnection,
  loadBlockChain,
  getBorder,
  canClaim,
  claim,
  getRoundUri
};