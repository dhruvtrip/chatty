import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/useAuthStore.js'
import './App.css'

export default function App() {

const username = useAuthStore(s => s.username);
return (
     <Routes>
          <Route path='/' element={<SignIn />} />
          <Route
            path='/chat'
            element={username ? <ChatRoom /> : <Navigate to='/' replace />}
          />
        </Routes>
    )

}

