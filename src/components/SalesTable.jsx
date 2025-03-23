import { format } from "date-fns";


const SalesTable = ({sales}) => {

    return (
        <div className="h-full w-full overflow-auto">
            <table className="w-full">
                <thead>
                    <tr className="grid grid-cols-7 p-5 text-[13px] border-1 border-blue-800 bg-blue-300 rounded-lg mb-2">
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Subtotal</th>
                        <th>Date & Time</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className="space-y-2">
                    {sales ? sales.map(sale => (
                        <tr key={sale.id} className="grid grid-cols-7 text-center border-1 border-blue-300 rounded-full p-3">
                            <td className="flex justify-center items-center">{sale.customer}</td>
                            <td className="flex justify-center items-center">{sale.product}</td>
                            <td className="flex justify-center items-center">{sale.quantity}</td>
                            <td className="flex justify-center items-center">₱{sale.unitPrice.toFixed(2)}</td>
                            <td className="flex justify-center items-center">₱{sale.subtotal.toFixed(2)}</td>
                            <td className="flex justify-center items-center text-[13px]">{format(sale.dateTime, "MMM dd, yyyy hh:mm a")}</td>
                            <td>
                                <button className="bg-primary text-white px-4 py-1 rounded-md hover:bg-primary-500 cursor-pointer">
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
