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
import AdminProfile from './componants/AdminProfile'
import CreateEvent from './componants/CreateEvent'
import CreateAdminEvent from './componants/CreateAdminEvent'
import ShowEvents from './componants/ShowEvents'
import EventDetail from './componants/EventDetail'
import EditEvent from './componants/EditEvent'
import ShowUserEventDetail from './componants/ShowUserEventDetail'
import CreateUser from './componants/CreateUser'
import ShowUsers from './componants/ShowUsers'
import ALLEvents from './componants/ALLEvents'
import AdminEventsDetail from './componants/AdminEventsDetail'
import AdminEditEvent from './componants/AdminEditEvent'



const App = () => {
  return (
   
    <>
    <Router>
      <MyNavbar />
      <Routes>
        <Route path='/' element={<UserHome />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='admin' element={<AdminDashboard />} />
        <Route path='user-dashboard' element={<UserDashboard />} />
        <Route path='organisateur' element={<OrganisateurDashboard />} />
        <Route path='/organisateur/profile' element ={<UserProfile />} />
        <Route path='/admin/profile' element ={<AdminProfile />} />
        <Route path='/admin/create-user' element ={<CreateUser />} />
        <Route path='/admin/users' element ={<ShowUsers />} />
        <Route path='/organisateur/create-event' element={<CreateEvent />} />
        <Route path='/admin/create-event' element={<CreateAdminEvent />} />
        <Route path='organisateur/events' element={<ShowEvents />} />
        <Route path='admin/events' element={<ALLEvents />} />
         <Route path="/event/:id" element={<EventDetail />} />
         <Route path="admin/event/:id" element={<AdminEventsDetail />} />
         <Route path="/user/event/:id" element={<ShowUserEventDetail />} />
         <Route path="/organisateur/edit-event/:id" element={<EditEvent />} />
         <Route path="/admin/edit-event/:id" element={<AdminEditEvent />} />



      </Routes>
    </Router>
    </>
  )
}

export default App
