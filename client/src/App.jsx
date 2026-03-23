import React from 'react'
import Navbar from './components/Navbar'
import { Routes, useLocation,Route} from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/Footer'
import AllRooms from './pages/Allrooms'
import RoomDetails from './pages/RoomDetails'
import MyBookings from './pages/MyBookings'
import HotelReg from './components/HotelReg'
import Layout from './pages/HotelOwner/Layout'
import Dashboard from './pages/HotelOwner/dashboard'
import ListRoom from './pages/HotelOwner/ListRoom'
import AddRoom from './pages/HotelOwner/AddRoom'


const App = () => {
    const location=useLocation();
    const isownerpath=location.pathname.includes("owner")
  return (
<div>
    {!isownerpath&&<Navbar/>}
    {false&&<HotelReg/>}
     {/* if it is the owner then we will not see the navbar */}
     <div className='min-h-[70vh]'>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/rooms' element={<AllRooms/>} />
        <Route path='/rooms/:id' element={<RoomDetails/>} />
        <Route path='/my-bookings' element={<MyBookings/>} />
        <Route path='/owner' element={<Layout/>}>  
          <Route index element={<Dashboard/>}/>
          <Route index element={<AddRoom/>}/>
          <Route index element={<ListRoom/>}/>




        </Route>
      </Routes>
     </div>
     <Footer/>
</div>
  )
}

export default App
// Here useLocation is just a function reference, not the location object.
// useLocation()  → returns location object current URL in the browser.So when we say “location object”, we mean information about the current page's URL.
// It tells React where the user currently is in the app.
// example output of the function useLocation it returns object which is stored in the location 
// {
//   pathname: "/dashboard",
//   search: "?id=10",
//   hash: "",
//   state: null,
//   key: "abc123"
// }
// location.pathname → gives the current URL path
// includes("owner") → checks if path contains "owner"

//template literals,useref,hooks