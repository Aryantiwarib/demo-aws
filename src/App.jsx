import { Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import StudentLayout from './layouts/StudentLayout'
import EmployeeLayout from './layouts/EmployeeLayout'
import DepartmentLayout from './layouts/DepartmentLayout'
import AuthLayout from './layouts/AuthLayout'
// import {NotificationProvider } from "../src/context/NotificationContext"

const App = () => {
  const { userRole, status: isAuthenticated } = useSelector(state => state.auth)
  const location = useLocation()
  //  const userId = useSelector(selectUserId);
  
  // Explicitly check for auth routes
  const isAuthRoute = ['/signup', '/forgot-password'].includes(location.pathname)

  const getLayout = () => {
    if (isAuthRoute) return 'auth'
    if (!isAuthenticated) return 'default'
    
    switch(userRole) {
      case 'student':
        return 'student'
      case 'employee':
        return 'employee'
      case 'academic':
      case 'fees':
      case 'exam':
      case 'placement':
        return 'department'
      default:
        return 'user'
    }
  }

  const currentLayout = getLayout()

  return (
    <>
      {/* Auth Layout (full width, no sidebar space) */}
      {isAuthRoute && (
        <div className="min-h-screen w-full">
          <AuthLayout>
            <Outlet />
          </AuthLayout>
        </div>
      )}

      {/* Authenticated Layouts */}
      {!isAuthRoute && (
        <div className="min-h-screen flex flex-col">
          {currentLayout === 'student' && <StudentLayout><Outlet /></StudentLayout>}
          
          {currentLayout === 'employee' && <EmployeeLayout><Outlet /></EmployeeLayout>}
          
          {currentLayout === 'department' && (
            <DepartmentLayout role={userRole}>
              <Outlet />
            </DepartmentLayout>
          )}
          
          {currentLayout === 'user' && (
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow">
                <Outlet />
              </main>
            </div>
          )}

          {/* Fallback for unauthenticated non-auth routes */}
          {currentLayout === 'default' && <Outlet />}
        </div>
      )}
    </>
  )
}

export default App