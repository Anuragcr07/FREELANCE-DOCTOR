import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import login from './login'



const landingpage = () => {
    const navigate = useNavigate()
  return (
    <div>
      Landing
      <button onClick={() => navigate('/login')}>Login</button>
      
    </div>
  )
}

export default landingpage
