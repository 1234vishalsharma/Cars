import { useState } from 'react'
import './App.css'
import {BrowserRouter , Routes , Route} from 'react-router-dom';
import Login from './Pages/Auth/Login';
import Signup from './Pages/Auth/Signup';
import OpenRoute from './ProtectedRoute/OpenRoute';
import Dashboard from './Pages/Dashboard';
import SpecificRoute from './ProtectedRoute/SpecificRoute';
import CarPage from './Pages/CarPage';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<SpecificRoute> <Login/> </SpecificRoute>}/>
        <Route path="/Signup" element={<SpecificRoute> <Signup/> </SpecificRoute>}/>
        <Route path="/" element={<OpenRoute> <Dashboard/> </OpenRoute> }/>
        <Route path="/Car/:carID" element={<OpenRoute> <CarPage/> </OpenRoute> }/>
      </Routes>
    </BrowserRouter>  
  )
}

export default App
