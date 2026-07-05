import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Start from './pages/Start.jsx'
import Home from './pages/Home.jsx'
import CaptainHome from './pages/CaptainHome.jsx'
import UserLogin from './pages/UserLogin.jsx';
import UserSignup from './pages/UserSignup.jsx';
import CaptainLogin from './pages/CaptainLogin.jsx';
import CaptainSignup from './pages/CaptainSignup.jsx';
import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import { CaptainContext } from "./context/CaptainContext";
import UserProtectedWrapper from './pages/UserProtectedWrapper.jsx'
import CaptainProtectedWrapper from './pages/CaptainProtectedWrapper.jsx'


const App = () => {
  const { user } = useContext(UserContext);
  const { captain } = useContext(CaptainContext);

  console.log(user);
  console.log(captain);
  
  return (
    <div>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route
          path="/Home"
          element={
            <UserProtectedWrapper>
              <Home />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/CaptainHome"
          element={
            <CaptainProtectedWrapper>
              <CaptainHome />
            </CaptainProtectedWrapper>
          }
        />
        <Route path='/UserLogin' element={<UserLogin />} />
        <Route path='/UserSignup' element={<UserSignup />} />
        <Route path='/CaptainLogin' element={<CaptainLogin />} />
        <Route path='/CaptainSignup' element={<CaptainSignup />} />
      </Routes>
    </div>)
}

export default App
