import Header from "../layouts/Header";
import AdminSidemenu from "../layouts/AdminSidemenu";
import Breadcrumb from "../components/Breadcrumb";
import Card1 from "../components/Card1";
import PieChart from "../components/PieChart";
import { Calculator, Package, Coins, ChartNoAxesCombined, Calendar } from 'lucide-react';
import SalesGraph from '../components/SalesGraph';
import Footer from "../layouts/Footer";

const AdminDashboard = () => {

    return (
        <div className="flex h-full w-full">
            <AdminSidemenu />
            <div className="h-full w-full overflow-y-auto scrollbar-thin">
                <Header />
                <div className="flex flex-col justify-between w-full h-fit gap-5">
                    <Breadcrumb />
                    <div className="grid grid-cols-4 w-full px-5 gap-5 mb-3">
                        <button className="flex items-center justify-center gap-2 bg-gray-400 focus:bg-primary py-2 rounded-full text-white text-[14px] font-medium shadow-md shadow-gray-900 cursor-pointer">
                            <Calendar size={15} /> Last Day
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-gray-400 focus:bg-primary py-2 rounded-full text-white text-[14px] font-medium shadow-md shadow-gray-900 cursor-pointer">
                            <Calendar size={15} /> Last Week
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-gray-400 focus:bg-primary py-2 rounded-full text-white text-[14px] font-medium shadow-md shadow-gray-900 cursor-pointer">
                            <Calendar size={15} /> Last Month
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-gray-400 focus:bg-primary py-2 rounded-full text-white text-[14px] font-medium shadow-md shadow-gray-900 cursor-pointer">
                            <Calendar size={15} /> Last Year
                        </button>
                    </div>
                    <div className="grid grid-cols-4 gap-5 w-full h-full px-4">
                        <Card1 icon={<Coins />} category="Total Sales" value="₱00,000" range="Last Month" />
                        <Card1 icon={<Calculator />} category="Total Expenses" value="₱00,000" range="Last Month" />
                        <Card1 icon={<Package />} category="Inventory Level" value="In Stock" range="All Products" />
                        <Card1 icon={<ChartNoAxesCombined />} category="Net Profit" value="₱00,000" range="Last Month" />
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
