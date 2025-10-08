import React from 'react'
import './App.css'
import UserHome from './Pages/UserHome'
import { BrowserRouter as Router , Routes,Route } from 'react-router-dom'
import Login from './auth/Login'
import Register from './auth/Register'
import MyNavbar from './componants/Navbar'
import AdminDashboard from './Pages/AdminDashboard'
import UserDashboard from './Pages/UserDashboard'
import OrganisateurDashboard from './Pages/OrganisateurDashboard'
import UserProfile from './componants/UserProfile'
import CreateEvent from './componants/CreateEvent'
import ShowEvents from './componants/ShowEvents'
import EventDetail from './componants/EventDetail'
import EditEvent from './componants/EditEvent'



const App = () => {
  return (
   
    <>
    <Router>
      <MyNavbar />
      <Routes>
        <Route path='/' element={<UserHome />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='admin-dashboard' element={<AdminDashboard />} />
        <Route path='user-dashboard' element={<UserDashboard />} />
        <Route path='organisateur' element={<OrganisateurDashboard />} />
        <Route path='/organisateur/profile' element ={<UserProfile />} />
        <Route path='/organisateur/create-event' element={<CreateEvent />} />
        <Route path='organisateur/events' element={<ShowEvents />} />
         <Route path="/event/:id" element={<EventDetail />} />
         <Route path="/organisateur/edit-event/:id" element={<EditEvent />} />


      </Routes>
    </Router>
    </>
  )
}

export default App
