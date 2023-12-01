import { useState, useEffect } from 'react';
import { loadBlockChain } from '../../lib/blockchainHandler';
import { on } from "../../lib/events";
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import './TodayNftCounter.css';

function TodayNftCounter(props) {
  const baseDate = new Date(2023, 11, 1, 17)
  const endDate = new Date(2023, 11, 24, 17)
  
  const [data, setdata] = useState({
    Balance: null,
    Total: null,
    DailySupply: null,
    NSupply: null,
    ESupply: null,
    GSupply: null
  })

  

  useEffect(() => {
    const load = async () => {
      console.log("Loading web3 connection")
      await loadBlockChain(setdata, differenceInCalendarDays(
        Date.now(),
        baseDate
        ))
    }
    load();
  }, [props]);

  return (<div class='counter'>
    <div style={{'width': '80%'}}>
    <p style={{'margin': '2px'}}>This the NFT Calendar, everyday until christmas you can claim an NFT to complete your calendar!</p>
    <p style={{'margin': '2px'}}>Each day you will have 100 tokens to be claimed, be fast or you will miss it!</p>
     <p style={{'margin': '2px'}}>You have claim <b>{data.Balance}</b> of <b>{Math.min(data.Total, differenceInCalendarDays(
    Date.now(),
    baseDate
    ))+1}</b></p>
     <p style={{'margin': '2px'}}>Daily available tokens:  <b>{data.DailySupply} ({data.NSupply}N / {data.ESupply}E / {data.GSupply}P)</b></p>
     <p style={{'margin': '2px'}}>Remeber, you can receive one of three class of token when you claim:</p>
      <p style={{'margin': '2px'}}>Common ={'>'} Black border {'('}60 per day{')'}</p>
      <p style={{'margin': '2px'}}>Special ={'>'} Blue border {'('}30 per day{')'}</p>
      <p style={{'margin': '2px'}}>Pro ={'>'} Orange border {'('}10 per day{')'}</p>
      <p style={{'margin': '2px'}}>Find yours today and Merry Christmas!</p>
      <p style={{'margin': '2px'}}>Donations to 0xadbDcFFD19A3bf5896a958D479E2B6D828dB1bb8 will be apreciated and dedicated for social projects</p>
    </div>
    <div style={{'marginRigth': '2px', 'alignContent':'right'}}>
      <img src='https://tenor.com/es/view/merry-christmas-christmas-tree-stars-sparkling-gif-15808783.gif' style={{'height':'200px'}}></img>
    </div>
    </div>)

}

export { TodayNftCounter };