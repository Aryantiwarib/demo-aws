import Sidebar from '../../components/admin/SideBar/SideBar'
// import DepartmentHeader from '..'
import { Header } from '../../components'

const DepartmentLayout = ({ children, role }) => {
  const departmentTitles = {
    academic: 'Academic Department Portal',
    fees: 'Fees Department Portal',
    exam: 'Examination Department Portal',
    placement: 'Placement Department Portal'
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={departmentTitles[role]} />
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DepartmentLayout