import React,{useState} from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Carts from './Pages/Carts/Carts'
import PlaceOrder from './Pages/PlaceOrder/PlaceOrder'
import Home from './Pages/Home/Home'
import ExploreMenu from './Components/ExploreMenu/ExploreMenu'
import Footer from './Components/Footer/Footer'
import LoginPopUp from './Components/LoginPopUp/LoginPopUp'

const App = () => {
  const [showLogin,setShowLogin]=useState(false);

  return (
    <>
    {showLogin?<LoginPopUp setShowLogin={setShowLogin}/>:<></>}
    <div className='app'>
      <Navbar setShowLogin={setShowLogin}/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/cart' element={<Carts/>}/>
        <Route path='/order' element={<PlaceOrder/>}/>
      </Routes>
      
    </div>
    <Footer/>
    </>
  )
}

export default App