import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Start from './pages/Start.jsx'
import Home from './pages/Home.jsx'
import UserLogin from './pages/UserLogin.jsx';
import UserSignup from './pages/UserSignup.jsx';
import CaptainLogin from './pages/CaptainLogin.jsx';
import CaptainSingnup from './pages/CaptainSingnup.jsx';
import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import { CaptainContext } from "./context/CaptainContext";


const App = () => {
  const { user } = useContext(UserContext);
  const { captain } = useContext(CaptainContext);

  console.log(user);
  console.log(captain);
  
  return (
    <div>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/Home' element={<Home/>} />
        <Route path='/UserLogin' element={<UserLogin />} />
        <Route path='/UserSignup' element={<UserSignup />} />
        <Route path='/CaptainLogin' element={<CaptainLogin />} />
        <Route path='/CaptainSingnup' element={<CaptainSingnup />} />
      </Routes>
    </div>)
}

export default App