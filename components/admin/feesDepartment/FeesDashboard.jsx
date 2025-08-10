import { FaMoneyBillWave, FaFileInvoice, FaChartLine, FaUserGraduate, FaBell } from 'react-icons/fa'
import { FiRefreshCw } from 'react-icons/fi'
import RecentTransactions from './RecentTransactions'
import FeeSummaryChart from './FeeSummaryChart.jsx'

const FeesDashboard = () => {
  // Sample data - replace with actual API calls
  const stats = [
    { title: 'Total Collected', value: '₹1,42,850', change: '+12%', icon: <FaMoneyBillWave className="text-green-500" /> },
    { title: 'Pending Fees', value: '₹24,300', change: '-5%', icon: <FaFileInvoice className="text-yellow-500" /> },
    { title: 'Students Paid', value: '87%', change: '+3%', icon: <FaUserGraduate className="text-blue-500" /> },
    { title: 'This Month', value: '₹56,200', change: '+18%', icon: <FaChartLine className="text-purple-500" /> }
  ]

  const notices = [
    { id: 1, title: 'Last date for fee submission', date: '25 Aug 2023', priority: 'high' },
    { id: 2, title: 'Scholarship applications open', date: '30 Aug 2023', priority: 'medium' },
    { id: 3, title: 'New payment gateway available', date: '15 Sep 2023', priority: 'low' }
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Fees Department Dashboard</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <FiRefreshCw /> Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className="text-3xl">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fee Summary Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Fee Collection Summary</h2>
            <select className="border border-gray-300 rounded px-3 py-1 text-sm">
              <option>This Month</option>
              <option>Last Quarter</option>
              <option>This Year</option>
            </select>
          </div>
          <FeeSummaryChart />
        </div>

        {/* Recent Notices */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Recent Notices</h2>
          <div className="space-y-4">
            {notices.map(notice => (
              <div key={notice.id} className="border-l-4 pl-4 py-2" style={{
                borderLeftColor: notice.priority === 'high' ? '#ef4444' : 
                                notice.priority === 'medium' ? '#f59e0b' : '#10b981'
              }}>
                <div className="flex items-start gap-2">
                  <FaBell className={`mt-1 ${notice.priority === 'high' ? 'text-red-500' : 
                                     notice.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'}`} />
                  <div>
                    <h3 className="font-medium">{notice.title}</h3>
                    <p className="text-sm text-gray-500">{notice.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-blue-600 text-sm font-medium hover:underline">
            View All Notices →
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <button className="text-blue-600 text-sm font-medium hover:underline">
            Export as CSV
          </button>
        </div>
        <RecentTransactions />
      </div>
    </div>
  )
}

export default FeesDashboard