import Header from "../layouts/Header";
import AdminSidemenu from "../layouts/AdminSidemenu";
import Breadcrumb from "../components/Breadcrumb";
import Card1 from "../components/Card1";
import RecentTransTable from "../components/RecentTransTable";
import PieChart from "../components/PieChart";
import { SquareArrowOutUpRight } from 'lucide-react';
import { Link } from "react-router-dom";
import { HandCoins, Calculator, Package, ChartArea } from 'lucide-react';
import SalesGraph from '../components/SalesGraph';

const AdminDashboard = () => {
    const sales = [
        { id: 1, customer: "Tagoloan Community College", total: 27.99, time: "2025-03-22 10:30 AM" },
        { id: 2, customer: "Walk In", total: 45.50, time: "2025-03-22 11:15 AM" },
        { id: 3, customer: "St. Paul Hospital", total: 32.75, time: "2025-03-22 12:00 PM" },
        { id: 4, customer: "Walk In", total: 18.20, time: "2025-03-22 12:45 PM" },
        { id: 5, customer: "Walk In", total: 18.20, time: "2025-03-22 12:45 PM" },
        { id: 6, customer: "Mr. DIY", total: 18.20, time: "2025-03-22 12:45 PM" },
      ];

    
    {/* Auto refresh every 10 minutes */}  
    setTimeout(() => {
        location.reload();
    }, 600000);
      

    return (
        <div className="h-full w-full scroll-smooth overflow-auto">
            <Header />
            <div className="flex h-full w-full fixed top-15">
                <AdminSidemenu />
                <div className="h-screen w-full ml-3 mt-2 mr-2 rounded-md overflow-auto">
                    <Breadcrumb />
                    <div className="grid grid-cols-4 gap-6 h-full w-full bg-white mt-3 rounded-md px-3">
                        <Card1 icon={<HandCoins />} category="Total Sales" value="₱70,000.00" range="Last 30 days" />
                        <Card1 icon={<Calculator />} category="Total Expenses" value="₱20,000.00" range="Last 30 days" />
                        <Card1 icon={<Package />} category="Inventory Level" value="In Stock" range="All products" />
                        <Card1 icon={<ChartArea />} category="Net Profit" value="₱50,000.00" range="From Last 30 days" />
                        <div className="col-span-3 h-fit w-full bg-white rounded-md">
                            <SalesGraph />
                        </div>
                        <div className="col-span-1 h-[500px] bg-white rounded-md shadow-md shadow-gray-500 border-1 border-gray-400 p-5">
                            <p>Sales Per Product</p>
                           <PieChart />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
