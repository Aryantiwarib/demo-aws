// import EmployeeHeader from '../components/EmployeeHeader'
// import EmployeeFooter from '../components/EmployeeFooter'


import {Header,Fotter} from "../../components"

const EmployeeLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-6 bg-gray-50">
        {children}
      </main>
      <Fotter />
    </div>
  )
}

export default EmployeeLayout