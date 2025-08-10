import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter } from 'react-router-dom'
import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store.js'

// pages
import Signup from "./pages/Signup.jsx"
import Login from './pages/Login.jsx'
import { DashBoard } from '../components/index.js'
import Notices from "./pages/NoticesList.jsx"
import AllNotice from "./pages/Notices.jsx"
import { MainDashBoard } from "../components/index.js"
import UserHome from '../components/User/Home/Home.jsx'
import UserProfile from '../components/User/Profile.jsx'

// Components
import AuthLayout from "../components/AuthLayout/AuthLayout.jsx"
import CreateNoticeTable from '../components/admin/Notices/NoticeForm.jsx'
import DashboardPage from '../components/admin/DashBoard/DashBoard.jsx'
import PublicLayout from '../components/publicLayout/publicLayout.jsx'
import RoleBasedRedirect from '../components/RoleBasedRedirect/RoleBasedRedirect.jsx'
import NoticeDetailPage from '../components/User/Notices/NoticeDtail.jsx'
import MyDashboard from '../components/admin/DashBoard/MyDashBoard.jsx'
import NoticeReadAnalytics from '../components/admin/Notices/NoticeReadAnalytics.jsx'
import UploadStudents from '../components/admin/StudentDetails/UploadStudents.jsx'
import HolidayAutomationDashboard from '../components/admin/DashBoard/holidayAutomation.jsx'
import AdminLoginPage from './pages/AdminLoginPage.jsx'
import AdminSignupPage from './pages/AdminSignupPage.jsx'
import FeesDashboard from '../components/admin/feesDepartment/FeesDashboard.jsx'
import StudentProfilePage from '../components/User/profile/profile.jsx'
import IDCardPage from '../components/User/IDCard/IDCard.jsx'
import SignatureCapture from '../components/admin/digitalSign/Signnature.jsx'
import EmployeeHomePage from "../components/Employees/Home/Home.jsx"
// import NoticeBell from "../components/admin/Notices/NoticeBell.jsx"
import ApprovalStatusBadge from "../components/admin/digitalSign/ApprovalStatusBadge.jsx"
import EmployeeApprovalDashboard from '../components/Employees/DigitalApproval/EmployeeApprovalDashboard.jsx'
import EmployeeApprovalItem from '../components/Employees/DigitalApproval/EmployeeApprovalItem.jsx'
import SignatureApproval from '../components/admin/digitalSign/SignatureApproval.jsx'
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <RoleBasedRedirect />
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/admin/login",
        element: (
          <AuthLayout authentication={false}>
            <AdminLoginPage />
          </AuthLayout>
        )
      },
       {
        path: "/admin-signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        )
      },
      // Admin-only routes
      {
        path: "/notices/:noticeId/analytics",
        element: (
          <AuthLayout authentication={true} allowedRoles={['academic']}>
            <DashboardPage />
          </AuthLayout>
        )
      },
      {
        path: "/create-notice",
        element: (
          <AuthLayout authentication={true} allowedRoles={['academic','fees']}>
            <CreateNoticeTable />
          </AuthLayout>
        )
      },
      {
        path: "/AllNotices",
        element: (
          <AuthLayout authentication={true} allowedRoles={['academic']}>
            <Notices />
          </AuthLayout>
        )
      },
      // Both admin and user can access
      {
        path: "/notices",
        element: (
          <AuthLayout authentication={true} allowedRoles={['academic', 'user']}>
            <AllNotice />
          </AuthLayout>
        )
      },
      // User-only routes
      // {
      //   path: '/HomePage',
      //   element: (
      //     <AuthLayout authentication={true} allowedRoles={['user']}>
      //       <UserHome />
      //     </AuthLayout>
      //   )
      // },
      {
        path: '/UserProfile',
        element: (
          <AuthLayout authentication={true} allowedRoles={['user']}>
            <UserProfile />
          </AuthLayout>
        )
      },
      {
        path: '/UserNotices',
        element: (
          <AuthLayout authentication={true} allowedRoles={['user']}>
            <div>User Notices Page</div>
          </AuthLayout>
        )
      },
      // Admin dashboard
      {
        path: "/academic-dashboard",
        element: (
          <AuthLayout authentication={true} allowedRoles={['academic']}>
            <MainDashBoard />
          </AuthLayout>
        )
      },
      {
        path: "/employee/dashboard",
        element: (
          <AuthLayout authentication={true} allowedRoles={['employee']}>
            <EmployeeHomePage />
          </AuthLayout>
        )
      },
      {
        path: "/notices/:noticeId",
        element: (
          <AuthLayout authentication={true} allowedRoles={['student']}>
            <NoticeDetailPage />
          </AuthLayout>
        )
      },
      {
        path: "/my-dashBoard",
        element: (
          <AuthLayout authentication={true} allowedRoles={['academic']}>
            <MyDashboard />
          </AuthLayout>
        )
      },
      {
        path: "/notices/edit/:noticeId",
        element: (
          <AuthLayout authentication={true} allowedRoles={['academic']}>
            <CreateNoticeTable />
          </AuthLayout>
        )
      },
      {
        path: "/notices/:noticeId/read-analytics",
        element: (
          <AuthLayout authentication={true} allowedRoles={['academic']}>
            <NoticeReadAnalytics />
          </AuthLayout>
        )
      },
      {
        path: "/add-student-details",
        element: (
          <AuthLayout authentication={true} allowedRoles={['academic']}>
            <UploadStudents />
          </AuthLayout>
        )
      },
      {
        path: "/holidays-automation",
        element: (
          <AuthLayout authentication={true} allowedRoles={['academic']}>
            <HolidayAutomationDashboard />
          </AuthLayout>
        )
      },
            {
        path: "/student/dashboard",
        element: (
          <AuthLayout authentication={true} allowedRoles={['student']}>
            <UserHome />
          </AuthLayout>
        )
      },
        {
        path: "/admin/fees-dashboard",
        element: (
          <AuthLayout authentication={true} allowedRoles={['fees']}>
            <FeesDashboard />
          </AuthLayout>
        )
      },
       {
        path: "/student/profile",
        element: (
          <AuthLayout authentication={true} allowedRoles={['student']}>
            <StudentProfilePage />
          </AuthLayout>
        )
      },
      {
        path: "/id-card",
        element: (
          <AuthLayout authentication={true} allowedRoles={['student']}>
            <IDCardPage />
          </AuthLayout>
        )
      },
      {
        path: "/digital-signature",
        element: (
          <AuthLayout authentication={false} >
            <SignatureCapture />
          </AuthLayout>
        )
      },
      {
        path: "/approvals",
        element: (
          <AuthLayout authentication={true} allowedRoles={['academic', 'employee']}>
            <EmployeeApprovalDashboard />
          </AuthLayout>
        )
      },
        {
        path: "/approvals/:id",
        element: (
          <AuthLayout authentication={true} allowedRoles={['academic', 'employee']}>
            <EmployeeApprovalItem />
          </AuthLayout>
        )
      },  
        {
        path: "approvals/:id/sign",
        element: (
          <AuthLayout authentication={true} allowedRoles={['academic', 'employee']}>
            <SignatureApproval />
          </AuthLayout>
        )
      },  
      
      // {
      //   path: "/approval/status-badge",
      //   element: (
      //     <AuthLayout authentication={false} allowedRoles={['employee']}>
      //       <ApprovalStatusBadge />
      //     </AuthLayout>
      //   )
      // }
      // {
      //   path: "/notifications",
      //   element: (
      //     <AuthLayout authentication={false} >
      //       <NoticeBell />
      //     </AuthLayout>
      //   )
      // }

      

    ]
  }
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)