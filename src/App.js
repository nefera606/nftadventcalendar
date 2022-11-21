import logo from './logo.svg';
import './App.css';
import { MetamaskButton } from './MetamaskButton';
import { TodayNftCounter } from './TodayNftCounter';
import { AdvientGallery } from './AdvientGallery';

function App() {
  return (
    <div>
      <MetamaskButton></MetamaskButton>
      <TodayNftCounter></TodayNftCounter>
      <AdvientGallery></AdvientGallery>
    </div>
  );
}

export default App;
