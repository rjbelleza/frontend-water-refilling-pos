import Header from "../layouts/Header";
import AdminSidemenu from "../layouts/AdminSidemenu";
import Breadcrumb from "../components/Breadcrumb";
import Card1 from "../components/Card1";
import PieChart from "../components/PieChart";
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
                <div className="flex flex-col justify-between w-full h-fit gap-5 overflow-x-hidden">
                    <Breadcrumb />
                    <div className="grid grid-cols-4 gap-5 w-full h-full px-4">
                        <Card1 icon={<HandCoins />} category="Total Sales" value="₱70,000" range="Last Month" />
                        <Card1 icon={<Calculator />} category="Total Expenses" value="₱20,000" range="Last Month" />
                        <Card1 icon={<Package />} category="Inventory Level" value="In Stock" range="All Products" />
                        <Card1 icon={<ChartArea />} category="Net Profit" value="₱50,000" range="Last Month" />
                    </div>
                    <div className="grid grid-cols-4 w-full py-2 px-4">
                        <div className="col-span-3">
                            <SalesGraph />
                        </div>
                        <div className="flex flex-col col-span-1 border border-gray-400 ml-4 rounded-lg">
                            <PieChart />
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
