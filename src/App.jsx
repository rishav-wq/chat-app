import { useContext, useEffect, useState } from 'react'
import {Route, Routes, useNavigate} from 'react-router-dom'
import Login from './pages/Login/Login'
import Chat from './pages/Chat/Chat'
import Profileupdate from './pages/ProfileUpdate/Profileupdate'
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/firebase' 
import { AppContext } from './context/AppContext'

function App() {

  const navigate = useNavigate();
  const {loadUserData} = useContext(AppContext)

  useEffect(() => {
    onAuthStateChanged(auth, async(user) => {
      if (user){
        navigate('/chat')
        await loadUserData(user.uid)
      }
      else{
        navigate('/')
      }
    })
  },[])


  return (
    <>
    <ToastContainer />
     <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/chat' element={<Chat />} />
      <Route path='/profile' element={<Profileupdate />} />
     </Routes>
    </>
  )
}

export default App
