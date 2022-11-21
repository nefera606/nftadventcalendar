import { useMetaMask } from "metamask-react";
import Grid from '@mui/material/Grid';
import './AdvientGallery.css';

function AdvientGallery() {

  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const {claimed, total} = {claimed: 23, total: 56}
  return (
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
  {Array.from(Array(6)).map((_, index) => (
    <Grid item xs={2} sm={4} md={4} key={index}>
      <div class='cover'></div>
    <img src='https://ipfs.io/ipfs/QmQqzMTavQgT4f4T5v6PWBp7XNKtoPmC9jvn12WPT3gkSE'></img>
    </Grid>
  ))}
  </Grid>)

}

export { AdvientGallery };