// import StudentHeader from '../components/StudentHeader'
// import StudentFooter from '../components/StudentFooter'


import {Header,Fotter} from "../../components"

const StudentLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-6 bg-gray-50">
        {children}
      </main>
      {/* <Fotter />x  */}
    </div>
  )
}

export default StudentLayout