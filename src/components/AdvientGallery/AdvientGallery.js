import Grid from '@mui/material/Grid';
import GradeIcon from '@mui/icons-material/Grade';
import { useState, useEffect } from 'react';
import './AdvientGallery.css';
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import isToday from 'date-fns/isToday'
import format from 'date-fns/format'
import isFuture from 'date-fns/isFuture'
import parse from 'date-fns/parse'
import Container from '@mui/material/Container';
import { canClaim, claim, claimStatus, getRoundUri, getBorder } from '../../lib/blockchainHandler'
import { TodayNftCounter } from '../TodayNftCounter/TodayNftCounter';
import Dialog from '@mui/material/Dialog';


function AdvientGallery() {

  const baseDate = new Date(2022, 10, 28)
  const endDate = new Date(2022, 11, 24)

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
      )+1 }, (v, i) => i)
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
    const setUp = async () => {
      const rounds = Array.from({ length: differenceInCalendarDays(
        Date.now(),
        baseDate
      )+1 }, (v, i) => i)
      let statuses = [];
      let uris = [];
      let borders = [];
      for(const round in rounds)
      { 
        let status = await claimStatus(round);
        let uri = await getRoundUri(round);
        let border = await getBorder(round);
        uris.push(uri);
        statuses.push(status);
        borders.push(border);
      }
      console.log(statuses)
      const getImage = (date, index) => {
        let parsed = parse(date,'dd-MMM', new Date());
        if(isFuture(parsed) || (isToday(parsed) && claimable)) {
          return "/notClaimed.png";
        }
        return uris[index];
      }
    
      const getClass = (date,status,border) => {
        let parsed = parse(date,'dd-MMM', new Date());
        if(!status && !(isFuture(parsed) || isToday(parsed))) {
          return "black-and-white"
        }
        if(!status && isToday(parsed) && claimable) {
          return "sparkling buzz-out-on-hover"
        }
        if(border === 2) {
          return "backimg-g"
        }
        if(border === 1) {
          return "backimg-e"
        }
        return "backimg"
      }

      const sortedList = eachDayOfInterval({
        start: baseDate,
        end: endDate
      }).map((date) => {
        return format(date, 'dd-MMM')
      }).map((nftDate, i) => {
        return {
          nftClaimed: statuses[i] ? true : false,
          nftDate: nftDate,
          nftClass: getClass(nftDate, statuses[i] ? true : false,borders[i]),
          nftImage: getImage(nftDate,i),
          nftBorder: borders[i]
        }
      });
      console.log(sortedList)
      const nftRandom = randomList.map((randomIndex) => {
        return sortedList[randomIndex]
      })
      setNftList(nftRandom);
    }
    setUp();
  }, [claimable, randomList]);

  const handleClaim = async (nft, index) => {
    if((claimable && isToday(parse(nft.nftDate,'dd-MMM', new Date()))))
    {
      let round = differenceInCalendarDays(
        Date.now(),
        baseDate
      )+1;
      await claim(setClaimable);
      let uri = await getRoundUri(round);
      let border = await getBorder(round);
      nft.nftClaimed = true;
      nft.nftImage = uri;
      nft.nftBorder = border;
      let _nftList = [...nftList];
      _nftList[index] = nft;
      setNftList(_nftList);
    }
    if(nft.nftClaimed) {
      let borders = ['modalImage','modalImage-e','modalImage-p']
      setModalClass(borders[nft.nftBorder])
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
            <p>{_.nftDate}</p>
            <GradeIcon></GradeIcon>
          </Container>
          <img class={_.nftClass} src={_.nftImage} onClick={() => {handleClaim(_, index)}}></img>
        </Grid>
        ))}
      </Grid>
    </div>)

}

export { AdvientGallery };

