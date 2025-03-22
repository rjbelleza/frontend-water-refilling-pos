
const RecentTransactionsTable = ({sales}) => {

    return (
        <div className="h-[310px] w-full overflow-auto">
            <table className="w-full">
                <thead className="bg-white sticky top-0 z-100">
                    <tr className="grid grid-cols-3 mb-2 p-3 border-3 border-blue-400 rounded-md">
                        <th className="text-left">Customer</th>
                        <th>Total Amount</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody className="space-y-1">
                    {sales ? sales.map(sale => (
                                <tr key={sale.id} className="grid grid-cols-3 p-4 border-1 border-blue-400 rounded-md">
                                    <td>{sale.customer}</td>
                                    <td className="text-left ml-14">₱{parseFloat(sale.total).toFixed(2)}</td>
                                    <td className="text-right">{sale.time}</td>
                                </tr>
                    )) : (
                        <div className="flex justify-center items-center h-[200px] w-full">
                            <p>No transactions yet</p>
                        </div>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default RecentTransactionsTable;
