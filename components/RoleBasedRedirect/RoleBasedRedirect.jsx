import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const RoleBasedRedirect = () => {
  const navigate = useNavigate()
  const userRole = useSelector(state => state.auth.userRole)
  const authStatus = useSelector(state => state.auth.status)

  useEffect(() => {
    if (authStatus) {
      if (userRole === 'academic') {
        navigate("/academic-dashboard")
      }else if(userRole === 'fees') {
        navigate('/admin/fees-dashboard')
      }
      else if (userRole === 'student') {
        navigate("/student/dashboard")
      } else if (userRole === 'employee') {
        navigate("/employee/dashboard")
      }
      else {
        navigate("/login") // fallback if role is not recognized
      }
    } else {
      navigate("/login")
    }
  }, [authStatus, userRole, navigate])

  return <div>Redirecting...</div>
}

export default RoleBasedRedirect