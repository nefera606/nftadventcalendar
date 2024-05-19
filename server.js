const express = require('express')
const ethers = require('ethers');
const PORT = process.env.PORT || 3000
const abi = require('./src/lib/abi');
const path = require('path');
const fs = require('fs');

const jsons =   [{
  "name": "1st of December",
  "external_url":"https://criptoadviento.net",
  "attributes":[],
  "description": "Generated Christmas image for the 1st day of December",
  "image": "https://criptoadviento.net/DIA_1.png"
},
{
  "name": "2nd of December",
  "external_url":"https://criptoadviento.net",
  "attributes":[],
  "description": "Generated Christmas image for the 2nd day of December",
  "image": "https://criptoadviento.net/DIA_2.png"
},
{
  "name": "3rd of December",
  "external_url":"https://criptoadviento.net",
  "attributes":[],
  "description": "Generated Christmas image for the 3rd day of December",
  "image": "https://criptoadviento.net/DIA_3.png"
},
{
  "name": "4th of December",
  "external_url":"https://criptoadviento.net",
  "attributes":[],
  "description": "Generated Christmas image for the 4th day of December",
  "image": "https://criptoadviento.net/DIA_4.png"
},
{
  "name": "5th of December",
  "external_url":"https://criptoadviento.net",
  "attributes":[],
  "description": "Generated Christmas image for the 5th day of December",
  "image": "https://criptoadviento.net/DIA_5.jpg"
},
{
  "name": "6th of December",
  "external_url":"https://criptoadviento.net",
  "attributes":[],
  "description": "Generated Christmas image for the 6th day of December",
  "image": "https://criptoadviento.net/DIA_6.png"
},
{
  "name": "7th of December",
  "external_url":"https://criptoadviento.net",
  "attributes":[],
  "description": "Generated Christmas image for the 7th day of December",
  "image": "https://criptoadviento.net/DIA_7.png"
},
{
  "name": "8th of December",
  "external_url":"https://criptoadviento.net",
  "attributes":[],
  "description": "Generated Christmas image for the 8th day of December",
  "image": "https://criptoadviento.net/DIA_8.png"
},
{
  "name": "9th of December",
  "external_url":"https://criptoadviento.net",
  "attributes":[],
  "description": "Generated Christmas image for the 9th day of December",
  "image": "https://criptoadviento.net/DIA_9.png"
},
{
  "name": "10th of December",
  "external_url":"https://criptoadviento.net",
  "attributes":[],
  "description": "Generated Christmas image for the 10th day of December",
  "image": "https://criptoadviento.net/DIA_10.png"
},
{
  "name": "11th of December",
  "external_url":"https://criptoadviento.net",
  "attributes":[],
  "description": "Generated Christmas image for the 11th day of December",
  "image": "https://criptoadviento.net/DIA_11.png"
},
{
  "name": "12th of December",
  "external_url":"https://criptoadviento.net",
  "attributes":[],
  "description": "Generated Christmas image for the 12th day of December",
  "image": "https://criptoadviento.net/DIA_12.png"
},
{
  "name": "13th of December",
  "external_url":"https://criptoadviento.net",
  "attributes":[],
  "description": "Generated Christmas image for the 13th day of December",
  "image": "https://criptoadviento.net/DIA_13.png"
},
{
  "name": "14th of December",
  "external_url":"https://criptoadviento.net",
  "attributes":[],
  "description": "Generated Christmas image for the 14th day of December",
  "image": "https://criptoadviento.net/DIA_14.png"
},
{
  "name": "15th of December",
  "external_url":"https://criptoadviento.net",
  "attributes":[],
  "description": "Generated Christmas image for the 15th day of December",
  "image": "https://criptoadviento.net/DIA_15.png"
},
{
  "name": "16th of December",
  "external_url":"https://criptoadviento.net",
  "attributes":[],
  "description": "Generated Christmas image for the 16th day of December",
  "image": "https://criptoadviento.net/DIA_16.png"
},
{
  "name": "17th of December",
  "external_url":"https://criptoadviento.net",
  "attributes":[],
  "description": "Generated Christmas image for the 17th day of December",
  "image": "https://criptoadviento.net/DIA_17.png"
},
{
  "name": "18th of December",
  "external_url":"https://criptoadviento.net",
  "attributes":[],
  "description": "Generated Christmas image for the 18th day of December",
  "image": "https://criptoadviento.net/DIA_18.png"
},
{
  "name": "19th of December",
  "external_url":"https://criptoadviento.net",
  "attributes":[],
  "description": "Generated Christmas image for the 19th day of December",
  "image": "https://criptoadviento.net/DIA_19.png"
},
{
  "name": "20th of December",
  "external_url":"https://criptoadviento.net",
  "attributes":[],
  "description": "Generated Christmas image for the 20th day of December",
  "image": "https://criptoadviento.net/DIA_20.png"
},
{
  "name": "21st of December",
  "external_url":"https://criptoadviento.net",
  "attributes":[],
  "description": "Generated Christmas image for the 21st day of December",
  "image": "https://criptoadviento.net/DIA_21.png"
},
{
  "name": "22nd of December",
  "external_url":"https://criptoadviento.net",
  "attributes":[],
  "description": "Generated Christmas image for the 22nd day of December",
  "image": "https://criptoadviento.net/DIA_22.png"
},
{
  "name": "23rd of December",
  "external_url":"https://criptoadviento.net",
  "attributes":[],
  "description": "Generated Christmas image for the 23rd day of December",
  "image": "https://criptoadviento.net/DIA_23.png"
},
{
  "name": "24th of December",
  "external_url":"https://criptoadviento.net",
  "attributes":[],
  "description": "Generated Christmas image for the 24th day of December",
  "image": "https://criptoadviento.net/DIA_24.png"
}]

const borderType = {
  "0": "Common",
  "1": "Special",
  "2": "Pro"
}

const providerUrl = 'https://polygon-mainnet.infura.io/v3/c77d171eeabf4d8f94803326931f0184'; // Reemplaza con tu URL de Infura
const contract = '0x18f808e072d09bEE48429C3504e452d6AfFb50ee';
//const MEMORY_PATH = '/app/claimedTokens.json'
const MEMORY_PATH = './claimedTokens.json'
let memory;

const app = express()
  .set('port', PORT)

// Static public files
app.use(express.static(path.join(__dirname, 'build')))

app.get('/', function(req, res) {
  res.send('Get ready for OpenSea!');
})
app.get('/api/token/list', function(req, res) {
  res.send(memory);
})

app.get('/api/token/:token_id', async function(req, res) {
  try {
    let response
    let nftBorder
    let nftRound
    // Definir la URL del proveedor (por ejemplo, Infura)
    if(memory[req.params.token_id]) {
      console.log('Taking from memory')
      nftBorder = memory[req.params.token_id].border
      nftRound = memory[req.params.token_id].round
    } else {
      console.log('Taking from blockchain')
      const provider = new ethers.JsonRpcProvider(providerUrl);
      const nft = new ethers.Contract(contract, abi.abi, provider);
      let supply = await nft.totalSupply();
      if(req.params.token_id >= Number(supply.toString())) {
        res.status(404).send()
        return 0
      }
      nftBorder = await nft.borderToken(req.params.token_id);
      nftRound = await nft.tokenInRound(req.params.token_id);
      memory[req.params.token_id] = {
        border: nftBorder.toString(),
        round: nftRound.toString()
      }
      fs.writeFileSync(MEMORY_PATH,JSON.stringify(memory));
    }
    console.log(`Requested token ${req.params.token_id} - border:${nftBorder} - round:${nftRound}`)
    response = jsons[nftRound]
    if(response.attributes.length < 1) {
      response.attributes.push({
        "trait_type": "Border",
        "value": borderType[nftBorder.toString()]
      })
    }
    res.send(response)
  } catch(e) {
    console.log(e.message)
    res.status(400).send()
  }
})

app.listen(app.get('port'), function() {
  memory = JSON.parse(fs.readFileSync(MEMORY_PATH,'utf-8'))
  console.log('Token status read from file: ' + JSON.stringify(memory));
  console.log('Node app is running on port', app.get('port'));
})
