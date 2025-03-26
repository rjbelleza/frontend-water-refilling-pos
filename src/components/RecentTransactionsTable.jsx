import { format } from "date-fns";
import { useState, useEffect } from "react";

const RecentTransactionsTable = ({sales}) => {
    const [count, setCount] = useState(0);
    let amount = 0;


    {/* Sum of total amount */}
    sales.forEach(sale => {
        amount+=sale.total;
    });

    
    useEffect(() => {
        if (sales) {
            setCount(sales.length);
        } else {
            setCount(0);
        }
    }, [sales]);


    return (
        <div className="h-[310px] w-full overflow-auto">
            <table className="w-full text-[14px]">
                <thead className="sticky top-0 z-100">
                    <tr className="grid grid-cols-4 mb-2 p-3 border-2 border-primary bg-blue-200 rounded-sm">
                        <th className="text-left pl-10 text-gray-800">Customer</th>
                        <th className="text-gray-800">Total Amount</th>
                        <th className="text-gray-800">Time</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className="">
                    {sales ? sales.map(sale => (
                                <tr key={sale.id} className="grid grid-cols-4 p-3 border-b-1 border-gray-300">
                                    <td className="pl-4">{sale.customer}</td>
                                    <td className="text-center">₱{parseFloat(sale.total).toFixed(2)}</td>
                                    <td className="text-center">{format(sale.time, "hh:mm:ss a")}</td>
                                    <td className="flex justify-center">
                                        <button>
                                            View
                                        </button>
                                    </td>
                                </tr>
                    )) : (
                        <tr className="flex justify-center items-center h-[200px] w-full">
                            <p>No transactions yet</p>
                        </tr>
                    )}
                    <tr className="h-[20px]"></tr>
                </tbody>
                <tfoot className="sticky bottom-0 z-100">
                    <tr>
                        <td className="font-bold bg-primary text-white rounded-sm py-2 pt-2 px-5">
                            Total Customers: {count}
                            <span className="ml-30">Sales: ₱{amount.toFixed(2)}</span>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

export default RecentTransactionsTable;
