import Grid from '@mui/material/Grid';
import GradeIcon from '@mui/icons-material/Grade';
import { useState, useEffect } from 'react';
import './AdvientGallery.css';
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import format from 'date-fns/format'
import Container from '@mui/material/Container';
import set from 'date-fns/set'
import { canClaim, claim, getRoundUri, getBorder } from '../../lib/blockchainHandler'
import { TodayNftCounter } from '../TodayNftCounter/TodayNftCounter';
import Dialog from '@mui/material/Dialog';


function AdvientGallery() {

  const baseDate = new Date(2022, 11, 1, 17)
  const endDate = new Date(2022, 11, 24, 17)

  const [ claimable, setClaimable] = useState(false);
  const [ randomList, setRandomList ] = useState([]);
  const [ nftList, setNftList ] = useState([]);
  const [ modalImage, setModalImage ] = useState('');
  const [ modalClass, setModalClass ] = useState('modalImage');
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);


  useEffect(() => {
    const update = async () => {
      let claimable_ = await canClaim();
      setClaimable(claimable_);
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
    }
    update()
  },[])

  useEffect(() => {
    let currentRound = differenceInCalendarDays(
      Date.now(),
      baseDate
    );
    const setUp = async () => {
      const rounds = Array.from({ length: currentRound + 1}, (v, i) => i)
      let statuses = [];
      let uris = [];
      let borders = [];
      for(const round in rounds)
      {
        let status = await canClaim(round);
        let uri = await getRoundUri(round);
        let border = await getBorder(round);
        uris.push(uri);
        statuses.push(status);
        borders.push(border);
      }
    
      const getImage = (round, status) => {
        if(round > currentRound) {
          return "/notClaimed.png";
        }
        if(round === currentRound && !status){
          return "/notClaimed.png";
        }
        return uris[round];
      }

      const getClass = (round,status,border) => {
        if(round === currentRound && !status) {
          return "sparkling buzz-out-on-hover"
        }
        if(round < currentRound && !status) {
          return "black-and-white"
        }
        if(border === '2') {
          return "backimg-g"
        }
        if(border === '1') {
          return "backimg-e"
        }
        return "backimg"
      }

      const sortedList = eachDayOfInterval({
        start: baseDate,
        end: endDate
      }).map((nftDate, i) => {
        let parsed = set(nftDate, {hours: 17})
        return {
          nftClaimed: statuses[i] ? true : false,
          nftDate: parsed,
          nftRound: i,
          nftFormatDate: format(nftDate, 'dd-MMM'),
          nftClass: getClass(i, statuses[i] ? true : false,borders[i]),
          nftImage: getImage(i, statuses[i] ? true : false),
          nftBorder: borders[i]
        }
      });
      const nftRandom = randomList.map((randomIndex) => {
        return sortedList[randomIndex]
      })
      setNftList(nftRandom);
    }
    setUp();
  }, [claimable, randomList]);

  const handleClaim = async (nft, index) => {
    let currentRound = differenceInCalendarDays(
      Date.now(),
      baseDate
    );
    if(nft.nftClaimed === false && nft.nftRound <= currentRound)
    {
      await claim(setClaimable, nft.nftRound);
      let uri = await getRoundUri(nft.nftRound);
      let border = await getBorder(nft.nftRound);
      nft.nftClaimed = true;
      nft.nftImage = uri;
      nft.nftBorder = border;
      let _nftList = [...nftList];
      _nftList[index] = nft;
      setNftList(_nftList);
    }
    if(nft.nftClaimed) {
      let bordersType = ['modalImage','modalImage-e','modalImage-p']
      setModalClass(bordersType[nft.nftBorder])
      setModalImage(nft.nftImage);
      setOpen(true);
    }
  }


  return (
    <div>
      <TodayNftCounter claimable={claimable}></TodayNftCounter>
      <Dialog onClose={handleClose} open={open}>
        <div class="modalContainer">
          <p>You receive this NFT!</p>
          <img class={modalClass} src={modalImage}></img>
        </div>
      </Dialog>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {nftList.map((_, index) => (
        <Grid item xs={2} sm={4} md={2} key={index} >
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

