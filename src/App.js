import logo from './logo.svg';
import './App.css';
import { AuctionContext, AuctionProvider } from './context/AuctionContext';
import { useContext, useEffect } from 'react';
import Header from './components/Header';

function App() {
  const {tittle} = useContext(AuctionContext)
  useEffect(() => {
  }, [])
  return (
    <div className="App">
      <Header/>
        {tittle}
    </div>
  );
}

export default App;
