import Grid from '@mui/material/Grid';
import GradeIcon from '@mui/icons-material/Grade';
import { useState, useEffect } from 'react';
import './AdvientGallery.css';
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import format from 'date-fns/format'
import Container from '@mui/material/Container';
import { claimed, claim, getTokenUri, claimedPerRound } from '../../lib/blockchainHandler'
import { TodayNftCounter } from '../TodayNftCounter/TodayNftCounter';
import Dialog from '@mui/material/Dialog';
import { on } from "../../lib/events";

function AdvientGallery() {
  const baseDate = new Date(2023, 11, 1, 17)
  const endDate = new Date(2023, 11, 24, 17)

  const [ randomList, setRandomList ] = useState([]);
  const [ nftList, setNftList ] = useState([]);
  const [ modalImage, setModalImage ] = useState('');
  const [ modalClass, setModalClass ] = useState('modalImage');
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

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
          await claim(nft.nftRound);
        }
        if(nft.nftClaimed) {
          let bordersType = {
            'backimg':'modalImage',
            'backimg-e':'modalImage-e',
            'backimg-g':'modalImage-p'
          }
          console.log('Creating modal with format'+ nft.nftClass + bordersType[nft.nftClass])
          setModalClass(bordersType[nft.nftClass])
          setModalImage(nft.nftImage);
          setOpen(true);
        }
    } catch (e) {
      window.alert(`${e.message}`)
    }
  }

  const handleNftList = async () => {
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
          console.log(`Procesing round ${round} for date ${date} of ${sortedList.length}`)
          console.log(`Today round ${currentRound}`);
          let status = await claimed(round);
          console.log(`Round status ${status}`)
          let metadata = undefined
          let _nftClass
          let _nftImage
          if(status) {
            let tokenIndex = await claimedPerRound(round);
            metadata = await getTokenUri(tokenIndex);
          }
          console.log(`Getting image and class for round from metada: ${JSON.stringify(metadata)}`)
          _nftClass = getClass(round, status, currentRound, metadata);
          _nftImage = getImage(round, status, currentRound, metadata)
          console.log(`Obtained class and image: ${_nftClass} and ${_nftImage}`)
          let nft = {
            nftFormatDate: format(date, 'dd-MMM'),
            nftClaimed: status,
            metadata: metadata,
            nftRound: round,
            nftClass: _nftClass,
            nftImage: _nftImage
          }
          console.log(`NFt created: ${JSON.stringify(nft)}`)
          _nftList.push(nft)
        } catch(e) {
          console.log(e)
        }
      }
    setNftList(_nftList);
  }

  useEffect(() => {
    on('claimed', () => {
      handleNftList();
    })
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
      await handleNftList()
    }
    setUp()
  },[])

  return (
    <div>
      <TodayNftCounter claimable={true}></TodayNftCounter>
      <Dialog style={{"maxWidth":"1024px"}} onClose={handleClose} open={open}>
        <div class="modalContainer">
          <p>You receive this NFT!</p>
          <img class={modalClass} src={modalImage}></img>
        </div>
      </Dialog>
      <Grid container style={{'justifyContent': 'center'}} spacing={{ xs: 2, sm: 2, md: 0 }} columns={{ xs: 4, sm: 4, md: 12 }}>
        {nftList.map((_, index) => (
        <Grid item justifyContent="space-around" xs={4} sm={2} md={3} key={index} >
          <Container class="dateLabel">
            <GradeIcon></GradeIcon>
            <p>{_.nftFormatDate}</p>
            <GradeIcon></GradeIcon>
          </Container>
          <img class={_.nftClass} src={_.nftImage} onClick={() => {handleClaim(_, index)}}></img>
        </Grid>
        ))}
      </Grid>
    </div>)

}

export { AdvientGallery };
