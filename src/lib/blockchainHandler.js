import Web3 from "web3";
import {
  abi
} from './abi';

let chainId;

const setConnection = (id, _provider) => {
  chainId = id;
  provider = _provider;
}

const NftAddress = {
  '0x5': '0x893fcDb225d0652DfFd1366662d6FDD10584eeba',
  '0x89': '0xe643Ee9d7516F956120E3A8C563037669e4d6CC4'
}


const loadBlockChain = async (setData) => {
  const web3 = new Web3(window.ethereum);
  const accounts = await web3.eth.getAccounts();
  const nft = new web3.eth.Contract(abi, NftAddress[chainId]);
  const nftBalance = await nft.methods.balanceOf(accounts[0]).call()
  const nftRounds = await nft.methods.rounds().call()
  const amount_n = await nft.methods.amount_n().call()
  const amount_e = await nft.methods.amount_e().call()
  const amount_p = await nft.methods.amount_p().call()
  const nftDailySupply = Number(amount_n) + Number(amount_e) + Number(amount_p);
  setData({
    Balance: nftBalance,
    Total: nftRounds,
    DailySupply: nftDailySupply,
    NSupply: amount_n,
    ESupply: amount_e,
    GSupply: amount_p
  });
}

const canClaim = async (_round) => {
  let round;
 const web3 = new Web3(window.ethereum);
 const nft = new web3.eth.Contract(abi, NftAddress[chainId]);
  if(!_round){
    round = await nft.methods.rounds().call();
    console.log('AQUIIIII')
    console.log(round)
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
  await nft.methods.claim(round).send({
      from: accounts[0]
    })
    .on('receipt', (receipt) => {
      setData(false)
    });
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