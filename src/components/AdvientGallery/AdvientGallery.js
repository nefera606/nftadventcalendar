import Grid from '@mui/material/Grid';
import GradeIcon from '@mui/icons-material/Grade';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import './AdvientGallery.css';
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import { format, addDays } from 'date-fns'
import Container from '@mui/material/Container';
import { claimed, claim, getTokenUri, claimedPerRound, getNftAddress } from '../../lib/blockchainHandler'
import { TodayNftCounter } from '../TodayNftCounter/TodayNftCounter';
import Dialog from '@mui/material/Dialog';

function AdvientGallery() {
  const baseDate = new Date(2023, 11, 1, 17)
  const endDate = new Date(2023, 11, 24, 17)

  const [ randomList, setRandomList ] = useState([]);
  const [ nftList, setNftList ] = useState([]);
  const [modalData, setModalData] = useState({'metadata':{'name':''}});
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const bordersType = {
    'backimg':'modalImage',
    'backimg-e':'modalImage-e',
    'backimg-g':'modalImage-p'
  }

  const getImage = (round, status, currentRound, metadata) => {
    if (!metadata) {
      return "/notClaimed.png";
    }
    if(round > currentRound) {
      return "/notClaimed.png";
    }
    if(!status){
      return "/notClaimed.png";
    }
    return metadata.image;
  }

  const getClass = (round, status, currentRound, metadata) => {
    if(round === currentRound && !status) {
      return "sparkling buzz-out-on-hover"
    }
    if(round < currentRound && !status) {
      return "black-and-white"
    }
    if (!metadata) {
      return "backimg";
    }
    if(metadata.attributes[0].value == 'Pro') {
      return "backimg-g"
    }
    if(metadata.attributes[0].value == 'Special') {
      return "backimg-e"
    }
    return "backimg"
  }

  const handleClaim = async (nft, index) => {
    try{
      let currentRound = differenceInCalendarDays(
        Date.now(),
        baseDate
        );
        if(nft.nftClaimed === false && nft.nftRound <= currentRound)
        {
          console.log("******* CLAIMING")
          let tx = await claim(nft.nftRound);
        }
        if(nft.nftClaimed) {
          console.log('Creating modal with format'+ nft.nftClass + bordersType[nft.nftClass])
          setModalData(nft);
          setOpen(true);
        }
    } catch (e) {
      console.log(e)
      window.alert(`${e.message}`)
    }
  }

  const addToMetamask = async () => {
    try {
      // 'wasAdded' is a boolean. Like any RPC method, an error can be thrown.
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC721', // or 'ERC1155'
          options: {
            address: getNftAddress(), // The address of the token.
            tokenId: `${modalData.nftId}`, // ERC-721 or ERC-1155 token ID.
          },
        },
      });
    
      if (wasAdded) {
        console.log('User successfully added the token!');
      } else {
        console.log('User did not add the token.');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleNftList = async () => {
    try {
      const sortedList = eachDayOfInterval({
        start: baseDate,
        end: endDate
      })
      let currentRound = differenceInCalendarDays(
        Date.now(),
        baseDate
      );
      let _nftList = [];
      for(const [round, date] of sortedList.entries())
      {
        try {
          console.log('======================');
          console.log(`Procesing round ${round + 1} for date ${date} of ${sortedList.length}`)
          console.log(`Today round ${currentRound}`);
          let status = await claimed(round);
          console.log(`Round status ${status}`)
          let metadata = undefined
          let _nftClass
          let _nftImage
          let tokenIndex
          if(status) {
            tokenIndex = await claimedPerRound(round);
            metadata = await getTokenUri(tokenIndex);
          }
          console.log(`Getting image and class for round from metada: ${JSON.stringify(metadata)}`)
          _nftClass = getClass(round, status, currentRound, metadata);
          _nftImage = getImage(round, status, currentRound, metadata)
          console.log(`Obtained class and image: ${_nftClass} and ${_nftImage}`)
          let nft = {
            nftFormatDate: format(date, 'dd-MMM'),
            nftId: tokenIndex,
            nftClaimed: status,
            metadata: metadata,
            nftRound: round,
            nftClass: _nftClass,
            nftImage: _nftImage
          }
          console.log(`NFT created: ${JSON.stringify(nft)}`)
          _nftList.push(nft)
        } catch(e) {
          console.log(e)
        }
      }
      return _nftList;
    } catch(e) {
      console.log('Error while setting up');
      console.log(e);
    }
  }

  useEffect(() => {
    // on('claimedyy', handleClaim2
    //   // let currentRound = differenceInCalendarDays(
    //   //   Date.now(),
    //   //   baseDate
    //   //   );
    //   // try {
    //   //   let metadata = undefined
    //   //   let _nftClass
    //   //   let _nftImage
    //   //   let tokenIndex
    //   //   tokenIndex = await claimedPerRound(round);
    //   //   metadata = await getTokenUri(tokenIndex);
    //   //   console.log(`Getting image and class for round from metada: ${JSON.stringify(metadata)}`)
    //   //   _nftClass = getClass(round, true, currentRound, metadata);
    //   //   _nftImage = getImage(round, true, currentRound, metadata)
    //   //   console.log(`Obtained class and image: ${_nftClass} and ${_nftImage}`)
    //   //   let nft = {
    //   //     nftFormatDate: format(addDays(baseDate,Number(round)), 'dd-MMM'),
    //   //     nftId: tokenIndex,
    //   //     nftClaimed: true,
    //   //     metadata: metadata,
    //   //     nftRound: round,
    //   //     nftClass: _nftClass,
    //   //     nftImage: _nftImage
    //   //   }
    //   //   console.log(`NFt created: ${JSON.stringify(nft)}`)
    //   //   let _nftList = nftList;
    //   //   _nftList.push(nft)
    //   //   setNftList(_nftList);
    //   //   setModalClass(bordersType[nft.nftClass])
    //   //   setModalImage(nft.nftImage);
    //   //   setModalIndex(nft.nftId);
    //   //   setOpen(true);
    //   // } catch(e) {
    //   //   console.log(e)
    //   // }
    // )
    const setUp = async () => {
      const base = Array.from({ length: differenceInCalendarDays(
        endDate,
        baseDate
        )+1}, (v, i) => i)
      const randomList = Array.from({length: base.length}, () => {
        let index = Math.floor(Math.random() * base.length)
        let value = base[index];
        base.splice(index,1)
        return value;
      });
      setRandomList(randomList)
      const nftList = await handleNftList();
      console.log('======================');
      console.log('Retrieved NFT list')
      let _randomList = randomList.map((i) => {
        return nftList[i];
      })
      setNftList(_randomList);
    }
    setUp()
  },[])

  const redirectToOpensea = () => {
    const newTab = window.open(`https://opensea.io/assets/matic/${getNftAddress()}/${`${modalData.nftId}`}`, '_blank');
    newTab.focus();
  };

  return (
    <div>
      <TodayNftCounter claimable={true}></TodayNftCounter>
      <Dialog onClose={handleClose} open={open} style={{"max-width": "none !important"}}>
        <div class="modalContainer">
          <h2>You receive this NFT!</h2>
          <h3>{modalData.metadata.name}</h3>
          <img class={bordersType[modalData.nftClass]} src={modalData.nftImage}></img>
          <h1> #{modalData.nftId} </h1>
          <div style={{'display':'flex'}}>
            <div style={{"width":"50%"}}>
              <Button startIcon={<img alt="Metamask Logo" style={{"height":"30px","width":"30px"}} src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/2048px-MetaMask_Fox.svg.png"></img>} onClick={addToMetamask} variant="contained">Add to metamask</Button>
            </div>
            <div style={{"width":"50%", "justifyContent":"right", "display":"flex"}}>
              
              <Button startIcon={<img alt="OpenSea Logo" src="https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.png" style={{"height":"30px","width":"30px"}}></img>} onClick={redirectToOpensea} variant="contained">View in Opensea</Button>
            </div>
          </div>
        </div>
      </Dialog>
      <Grid container style={{'justifyContent': 'center'}} spacing={{ xs: 2, sm: 2, md: 0 }} columns={{ xs: 4, sm: 4, md: 4 }}>
        {nftList.map((_, index) => (
        <Grid item justifyContent="center" xs={4} sm={2} md={1} mdOffset={1} key={index} >
          <div style={{'display':'flex', "justifyContent":"center","marginBottom":"10px"}}>
            <div>
              <Container class="dateLabel">
                <GradeIcon></GradeIcon>
                  <p>{_.nftFormatDate}</p>
                <GradeIcon></GradeIcon>
              </Container>
              <img class={_.nftClass} src={_.nftImage} onClick={() => {handleClaim(_, index)}}></img>
            </div>
          </div>
        </Grid>
        ))}
      </Grid>
    </div>)

}

export { AdvientGallery };
