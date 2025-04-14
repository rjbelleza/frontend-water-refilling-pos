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
import Footer from "../layouts/Footer";

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
        <div className="flex h-full w-full">
            <AdminSidemenu />
            <div className="h-full w-full overflow-auto">
                <Header />
                <div className="flex flex-col justify-between w-full h-full">
                    <div className="grid grid-cols-4 gap-4 w-full p-4">
                        <Card1 icon={<HandCoins />} category="Total Sales" value="P70,000.00" range="Last 30 days" />
                        <Card1 icon={<Calculator />} category="Total Expenses" value="P20,000.00" range="Last 30 days" />
                        <Card1 icon={<Package />} category="Inventory Level" value="In Stock" range="All Products" />
                        <Card1 icon={<ChartArea />} category="Net Profit" value="P50,000.00" range="Last 30 days" />
                    </div>
                    <div className="flex w-full p-4">
                        <SalesGraph />
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
