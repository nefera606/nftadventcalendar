import './App.css';
import { useState, useEffect } from 'react';
import { MetamaskButton } from '../components/MetamaskButton/MetamaskButton';
import { AdvientGallery } from '../components/AdvientGallery/AdvientGallery';
import { on } from "../lib/events";

function App() {
  const [ status, setStatus ] = useState(false);

  useEffect(() => {
    on('statusChange', () => {
      setStatus(true)
    })
  })

  return (
    <div class="frame">
      <MetamaskButton></MetamaskButton>
      {status && <AdvientGallery></AdvientGallery>}
    </div>
  );

}

export default App;
