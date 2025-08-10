const RecentTransactions = () => {
  const transactions = [
    { id: 1, student: 'Aarav Sharma', amount: '₹12,500', date: '15 Aug 2023', status: 'completed' },
    { id: 2, student: 'Neha Patel', amount: '₹8,300', date: '14 Aug 2023', status: 'completed' },
    { id: 3, student: 'Rohan Verma', amount: '₹15,000', date: '14 Aug 2023', status: 'pending' },
    { id: 4, student: 'Priya Singh', amount: '₹10,200', date: '13 Aug 2023', status: 'completed' },
    { id: 5, student: 'Vikram Joshi', amount: '₹9,500', date: '12 Aug 2023', status: 'refunded' }
  ]

  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    refunded: 'bg-blue-100 text-blue-800'
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((txn) => (
            <tr key={txn.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{txn.student}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{txn.amount}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{txn.date}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${statusColors[txn.status]}`}>
                  {txn.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecentTransactions