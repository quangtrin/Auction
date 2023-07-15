import logo from './logo.svg';
import './App.css';
import { AuctionContext, AuctionProvider } from './context/AuctionContext';
import { useContext, useEffect } from 'react';

function App() {
  const {tittle} = useContext(AuctionContext)
  useEffect(() => {
  }, [])
  return (
    <div className="App">
        {tittle}
    </div>
  );
}

export default App;
