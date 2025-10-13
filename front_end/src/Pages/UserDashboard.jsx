import React from 'react'
import UserSideBar from '../componants/UserSideBar'
import img from '../assets/userdashboard.png'
import '../styles/UserDashboard.css'
const UserDashboard = () => {
  return (
    <>
     <UserSideBar />

     <div className='user-dashboard'>
     <img src={img} alt="" />
     </div>
    
    </>
  )
}

export default UserDashboard
