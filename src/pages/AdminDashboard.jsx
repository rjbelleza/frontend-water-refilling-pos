import Header from "../layouts/Header";
import AdminSidemenu from "../layouts/AdminSidemenu";
import Breadcrumb from "../components/Breadcrumb";
import Card1 from "../components/Card1";
import PieChart from "../components/PieChart";
import { Calculator, Store, Coins, ChartNoAxesCombined, Calendar } from 'lucide-react';
import SalesGraph from '../components/SalesGraph';
import Footer from "../layouts/Footer";
import api from "../api/axios";
import { useEffect, useState } from "react";
import Snackbar from '../components/Snackbar';
import ComponentLoading from "../components/ComponentLoading";
import AlertPopUp from "../components/AlertPopUp";

const AdminDashboard = () => {
    const [range, setRange] = useState('last_year');
    const [summary, setSummary] = useState([]);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [message, setMessage] = useState('');
    const [responseStatus, setResponseStatus] = useState('');
    const [loading, setLoading] = useState(true);
    
    const fetchSummaryByRange = async () => {
        try {
          const response = await api.get('/dashboard-summary', {
            params: { range: range }
          });
          setSummary(response.data?.data);
        } catch (err) {
          setMessage(err.response?.data?.message || 'Something went wrong');
          setResponseStatus(err.response?.data?.status || 'error');
          setShowSnackbar(true);
        } finally {
          setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchSummaryByRange();
    }, [range]);

    const formatCurrency = (value) => {
        if(loading) {
            return <ComponentLoading />
        }
        if(isNaN(value)) {
            return  <ComponentLoading />
        }
        return `₱ ${Number(value).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    };

    return (
        <div className="flex h-full w-full">

            {showSnackbar && (
                <Snackbar 
                message={message && message}
                type={responseStatus}
                onClose={() => setShowSnackbar(false)}
                />
            )}
            
            <AdminSidemenu />
            <div className="h-full w-full overflow-y-auto scrollbar-thin">
                <Header />
                <div className="flex flex-col justify-between w-full h-fit gap-5 overflow-x-hidden">
                    <Breadcrumb />
                    <div className="grid grid-cols-4 w-full px-5 gap-5 mb-3">
                        <AlertPopUp />
                        <button 
                            onClick={() => setRange('last_day')}
                            className={`flex items-center justify-center gap-2 ${range === 'last_day' ? 'bg-primary' : 'bg-gray-500'}  focus:bg-primary py-2 rounded-full text-white text-[14px] font-medium shadow-md shadow-gray-900 cursor-pointer`}>
                            <Calendar size={15} /> Last Day
                        </button>
                        <button 
                            onClick={() => setRange('last_week')}
                            className={`flex items-center justify-center gap-2 ${range === 'last_week' ? 'bg-primary' : 'bg-gray-500'}  focus:bg-primary py-2 rounded-full text-white text-[14px] font-medium shadow-md shadow-gray-900 cursor-pointer`}>
                            <Calendar size={15} /> Last Week
                        </button>
                        <button 
                            onClick={() => setRange('last_month')}
                            className={`flex items-center justify-center gap-2 ${range === 'last_month' ? 'bg-primary' : 'bg-gray-500'}  focus:bg-primary py-2 rounded-full text-white text-[14px] font-medium shadow-md shadow-gray-900 cursor-pointer`}>
                            <Calendar size={15} /> Last Month
                        </button>
                        <button 
                            onClick={() => setRange('last_year')}
                            className={`flex items-center justify-center gap-2 ${range === 'last_year' ? 'bg-primary' : 'bg-gray-500'}  focus:bg-primary py-2 rounded-full text-white text-[14px] font-medium shadow-md shadow-gray-900 cursor-pointer`}>
                            <Calendar size={15} /> Last Year
                        </button>
                    </div>
                    <div className="grid grid-cols-4 gap-5 w-full h-full px-4">
                        <Card1 icon={<Store />} category="Total Transactions" value={loading ? <ComponentLoading /> : summary.sales_count} range="Last Month" />
                        <Card1 icon={<Coins />} category="Total Sales" value={formatCurrency(summary.total_sales)} range="Last Month" />
                        <Card1 icon={<Calculator />} category="Total Expenses" value={formatCurrency(summary.total_expenses)} range="Last Month" />
                        <Card1 icon={<ChartNoAxesCombined />} category="Net Profit" value={formatCurrency(summary.net_profit)} range="Last Month" />
                    </div>
                    <div className="grid grid-cols-4 w-full py-2 px-4">
                        <div className="col-span-4">
                            <SalesGraph range={range} />
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
