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
import Footer from './componants/Footer'
import Subscibes from './componants/Subscribes'
import WhoUs from './componants/WhoUs'
import Faqs from './componants/Faqs'
import Politiques from './componants/Politiques'
import Checkout from './componants/Checkout'
import CheckoutForm from './componants/CheckoutForm.'
import Success from './componants/Success'
import Cart from './componants/Cart'
import UserrProfile from './componants/UserrProfile'
import CategoryPages from './componants/CategoryPages'
import SearchResults from './componants/SearchResults'
import ContactUs from './componants/ContactUs'
import ForgotPassword from "./Pages/ForgotPassword";
import TopBanner from './componants/TopBanner'


const App = () => {
  return (
   
    <>
    <Router>
       <TopBanner /> 
      <MyNavbar />
      <Routes>
        <Route path='/' element={<UserHome />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='admin' element={<AdminDashboard />} />
        <Route path='user' element={<UserDashboard />} />
        <Route path='organisateur' element={<OrganisateurDashboard />} />
        <Route path='/organisateur/profile' element ={<UserProfile />} />
        <Route path='/admin/profile' element ={<AdminProfile />} />
        <Route path='/user/profile' element ={<UserrProfile/>} />

        <Route path='/admin/create-user' element ={<CreateUser />} />
        <Route path='/admin/users' element ={<ShowUsers />} />
        <Route path='/organisateur/create-event' element={<CreateEvent />} />
        <Route path='/admin/create-event' element={<CreateAdminEvent />} />
        <Route path='organisateur/events' element={<ShowEvents />} />
        <Route path='admin/events' element={<ALLEvents />} />
        <Route path='user/achats' element={<Cart/>} />

         <Route path="/event/:id" element={<EventDetail />} />
         <Route path="admin/event/:id" element={<AdminEventsDetail />} />
         <Route path="/user/event/:id" element={<ShowUserEventDetail />} />
         <Route path="/organisateur/edit-event/:id" element={<EditEvent />} />
         <Route path="/admin/edit-event/:id" element={<AdminEditEvent />} />
          <Route path='qui-sommes-nous' element={<WhoUs />} />
          <Route path='faq' element={<Faqs />} />
          <Route path='politique' element={<Politiques/>} />
         <Route path="/user/event/:id/checkout" element={<Checkout />} />
         <Route path="/create-payement" element={<Checkout />} />
<Route path="/success" element={<Success />} />
<Route path="/cancel" element={<h1>Paiement annulé </h1>} />
<Route path='/cart' element={<Cart />} />

 <Route path="/:category" element={<CategoryPages />} />

 
<Route path="/event" element={<SearchResults />} />

<Route path="/contactez-nous" element={<ContactUs />} />

<Route path="/forgot-password" element={<ForgotPassword />} />


      </Routes>
    <Subscibes />

      <Footer />
    </Router>
    </>
  )
}

export default App
