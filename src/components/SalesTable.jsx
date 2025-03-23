import { format } from "date-fns";


const SalesTable = ({sales, products}) => {

    return (
        <div className="h-full w-full shadow-md shadow-gray-400 rounded-lg px-2 overflow-auto">

            <div className="flex justify-between w-full bg-white sticky top-0 p-2 gap-5">

                <div className="flex gap-2 bg-white">
                    {/* Search by customer */}
                    <form>
                        <input type="text" placeholder="Search by customer..." className="border-1 border-gray-500 p-1 px-4 rounded-sm" />
                    </form>

                    {/* Filter by product */}
                    <select className="px-2 border-1 border-gray-500 rounded-sm">
                        <option>All</option>
                        {products ? products.map(product => (
                            <option key={product.id}>{product.name}</option>
                        )) : (
                            <option>All</option>
                        )}
                    </select>

                    {/* Filter by date */}
                    <input type="date" className="px-3 border-1 border-gray-500 rounded-sm" />
                </div>

                <button className="bg-blue-700 text-white px-5 rounded-md cursor-pointer hover:bg-blue-500">
                    Create New Transaction
                </button>
            </div>

            <table className="w-full">
                <thead className="sticky top-13 z-99">
                    <tr className="grid grid-cols-7 p-4 text-[12px] border-1 border-blue-800 bg-blue-300 rounded-lg mb-2">
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Subtotal</th>
                        <th>Date & Time</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className="space-y-2 font-medium">
                    {sales ? sales.map(sale => (
                        <tr key={sale.id} className="grid grid-cols-7 text-center text-[12px] border-1 border-blue-300 rounded-full p-3">
                            <td className="flex justify-center items-center">{sale.customer}</td>
                            <td className="flex justify-center items-center">{sale.product}</td>
                            <td className="flex justify-center items-center">{sale.quantity}</td>
                            <td className="flex justify-center items-center">₱{sale.unitPrice.toFixed(2)}</td>
                            <td className="flex justify-center items-center">₱{sale.subtotal.toFixed(2)}</td>
                            <td className="flex justify-center items-center text-[13px]">{format(sale.dateTime, "MMM dd, yyyy hh:mm a")}</td>
                            <td>
                                <button className="bg-primary text-white px-4 py-1 rounded-md hover:bg-blue-900 cursor-pointer">
                                    Select
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default SalesTable;
