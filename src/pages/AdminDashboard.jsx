import Header from "../layouts/Header";
import AdminSidemenu from "../layouts/AdminSidemenu";
import Breadcrumb from "../components/Breadcrumb";
import Card1 from "../components/Card1";
import RecentTransactionsTable from "../components/RecentTransactionsTable";

const AdminDashboard = () => {
    const sales = [
        { id: 1, customer: "John Doe", total: 25.99, time: "2025-03-22 10:30 AM" },
        { id: 2, customer: "In Store", total: 45.50, time: "2025-03-22 11:15 AM" },
        { id: 3, customer: "Alice Johnson", total: 32.75, time: "2025-03-22 12:00 PM" },
        { id: 4, customer: "In Store", total: 18.20, time: "2025-03-22 12:45 PM" },
        { id: 5, customer: "In Store", total: 18.20, time: "2025-03-22 12:45 PM" },
        { id: 6, customer: "Bob Brown", total: 18.20, time: "2025-03-22 12:45 PM" },
      ];
      

    return (
        <div className="h-screen w-full bg-gray-300 scroll-smooth">
            <Header />
            <div className="flex h-full w-full mt-15">
                <AdminSidemenu />
                <div className="h-full w-full ml-63 mt-2 mr-2 rounded-md">
                    <Breadcrumb />
                    <div className="grid grid-cols-4 gap-6 h-fit w-full bg-white mt-2 rounded-md p-5">
                        <Card1 url="card-bg1.png" category="Total Sales" value="₱70,000.00" range="Last 30 days" color="#f257a0" />
                        <Card1 url="card-bg2.png" category="Total Expenses" value="₱20,000.00" range="Last 30 days" color="#c157f2" />
                        <Card1 url="card-bg3.png" category="Inventory Level" value="In Stock" range="Current inventory" color="#575cf2" />
                        <Card1 url="card-bg4.png" category="Net Profit" value="₱50,000.00" range="From Last 30 days" color="#57c4f2" />
                        <div className="col-span-2 h-[400px] bg-white rounded-md shadow-md shadow-gray-500 border-1 
                                      border-blue-400 p-5 space-y-3"
                        >
                            <h3 className="text-[17px] font-medium">Recent Transactions (Today)</h3>
                            <RecentTransactionsTable sales={sales} />
                        </div>
                        <div className="col-span-2 h-[400px] bg-white rounded-md shadow-md shadow-gray-500 border-1 
                                      border-blue-400 p-5"
                        >

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
