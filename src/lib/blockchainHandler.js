import { useConnectedMetaMask } from "metamask-react";
import Web3 from "web3";
import {
  abi
} from './abi';

let chainId;

const setChainId = (id) => {
  chainId = id;
}

const NftAddress = () => {
  if(chainId === '0x5') 
    {
      return '0xffA604a140d6f825DCc91318f1bFC2F76432777A'
    }
  if(chainId === '0x89') 
    {
      return '0x04904C45093FfFDC8839280c0a32554B477a63EF'
    }
  }

const loadBlockChain = async (setData) => {
  const web3 = new Web3(Web3.givenProvider);
  const accounts = await web3.eth.getAccounts();
  const nft = new web3.eth.Contract(abi, NftAddress());
  const nftBalance = await nft.methods.balanceOf(accounts[0]).call()
  const nftRounds = await nft.methods.rounds().call()
  const nftDailySupply = await nft.methods.availableRoundSupply().call()
  const amount_n = await nft.methods.amount_n().call()
  const amount_e = await nft.methods.amount_e().call()
  const amount_p = await nft.methods.amount_p().call()
  setData({
    Balance: nftBalance,
    Total: nftRounds,
    DailySupply: nftDailySupply,
    NSupply: amount_n,
    ESupply: amount_e,
    GSupply: amount_p
  });
}

const canClaim = async () => {
  const web3 = new Web3(Web3.givenProvider);
  const nft = new web3.eth.Contract(abi, NftAddress());
  const accounts = await web3.eth.getAccounts();
  const canClaim = await nft.methods.canClaim(accounts[0]).call()
  return canClaim;
}

const getBorder = async (round) => {
  const web3 = new Web3(Web3.givenProvider);
  const nft = new web3.eth.Contract(abi, NftAddress());
  const accounts = await web3.eth.getAccounts();
  const tokenId = await nft.methods.claimedPerRound(round, accounts[0]).call()
  const border = await nft.methods.borderToken(tokenId).call()
  return border;
}

const claimStatus = async (index) => {
  const web3 = new Web3(Web3.givenProvider);
  const nft = new web3.eth.Contract(abi, NftAddress());
  const accounts = await web3.eth.getAccounts();
  console.log(index)
  return await nft.methods.claimed(index, accounts[0]).call()
}

const claim = async (setData) => {
  const web3 = new Web3(Web3.givenProvider);
  const nft = new web3.eth.Contract(abi, NftAddress());
  const accounts = await web3.eth.getAccounts();
  await nft.methods.claim().send({
      from: accounts[0]
    })
    .on('receipt', (receipt) => {
      setData(false)
    });
}

const getRoundUri = async (round) => {
  const web3 = new Web3(Web3.givenProvider);
  const nft = new web3.eth.Contract(abi, NftAddress());
  const accounts = await web3.eth.getAccounts();
  const roundId = await nft.methods.claimedPerRound(round, accounts[0]).call()
  const uri = await nft.methods.tokenURI(roundId).call()
  return uri;
}



export {
  setChainId,
  loadBlockChain,
  getBorder,
  canClaim,
  claim,
  claimStatus,
  getRoundUri
};