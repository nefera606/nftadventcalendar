import { useState, useEffect } from 'react';
import { loadBlockChain } from '../../lib/blockchainHandler'


function TodayNftCounter(props) {

  const [data, setdata] = useState({
    Balance: null,
    Total: null,
    DailySupply: null,
    NSupply: null,
    ESupply: null,
    GSupply: null
  })

  useEffect(() => {
    console.log("Loading web3 connection")
    loadBlockChain(setdata)
  }, [props]);

  return (<div style={{'backgroundColor': 'indianred', 'color': 'white','padding-left': '5px','border-radius':'5px'}}>
    <p>This the NFT Calendar, everyday you can claim an NFT to complete your calendar!</p>
     <p>You have claim <b>{data.Balance}</b> of <b>{data.Total}</b></p>
     <p>Daily available tokens:  <b>{data.DailySupply} ({data.NSupply}N / {data.ESupply}E / {data.GSupply}P)</b></p>
     <p>Remeber, you can receive one of three class of token when you claim:</p>
      <p>Normal -{'>'} Black border</p>
      <p>Especial -{'>'} Blue border</p>
      <p>Pro -{'>'} Orange border</p>
     <p>Find yours today and Merry Christmas!</p>
    </div>)

}

export { TodayNftCounter };