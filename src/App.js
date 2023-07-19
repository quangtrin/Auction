import './App.css';
import { AuctionContext, AuctionProvider } from './context/AuctionContext';
import { useContext, useEffect } from 'react';
import Header from './components/Header';
import { Route, Routes } from 'react-router-dom';
import Auctions from './pages/Auctions/Auctions';
import MyCollection from './pages/MyCollection';
import AllToken from './pages/AllToken'
import History from './pages/History';


function App() {
  const { tittle } = useContext(AuctionContext)
  useEffect(() => {
  }, [])
  return (
    <div className="App">
      <Header />
      <div style={{ marginTop: "70px", padding: "0 20px" }}>
        <Routes>
          <Route path='/' element={<Auctions />} />
          <Route path='/auctions' element={<Auctions />} />
          <Route path='/myCollection' element={<MyCollection />} />
          <Route path='/allToken' element={<AllToken />} />
          <Route path='/history' element={<History />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
