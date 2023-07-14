import logo from './logo.svg';
import './App.css';
import { AuctionContext, AuctionProvider } from './context/AuctionContext';
import { useContext } from 'react';

function App() {
  const {tittle} = useContext(AuctionContext)
  return (
    <div className="App">
        {tittle}
    </div>
  );
}

export default App;
