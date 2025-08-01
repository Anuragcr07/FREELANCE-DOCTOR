import React from 'react'
import Dashboard from './dashboard'
import { useNavigate } from 'react-router-dom'



const login = () => {
    const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => navigate('/dashboard')}>verification complete</button>
    </div>
  )
}

export default login
