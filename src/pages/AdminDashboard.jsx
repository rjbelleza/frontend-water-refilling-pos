import Header from "../layouts/Header";
import AdminSidemenu from "../layouts/AdminSidemenu";
import Breadcrumb from "../components/Breadcrumb";
import Card1 from "../components/Card1";

const AdminDashboard = () => {

    return (
        <div className="h-screen w-full bg-gray-300 scroll-smooth">
            <Header />
            <div className="flex h-full w-full mt-15">
                <AdminSidemenu />
                <div className="h-full w-full ml-63 mt-2 mr-2 rounded-md">
                    <Breadcrumb />
                    <div className="grid grid-cols-4 gap-6 h-full w-full bg-white mt-2 rounded-md p-5">
                        <Card1 url="card-bg1.png" category="Total Sales" value="₱70,000.00" range="Last 30 days" color="#f257a0" />
                        <Card1 url="card-bg2.png" category="Total Expenses" value="₱20,000.00" range="Last 30 days" color="#c157f2" />
                        <Card1 url="card-bg3.png" category="Inventory Level" value="In Stock" range="Current inventory" color="#575cf2" />
                        <Card1 url="card-bg4.png" category="Net Profit" value="₱50,000.00" range="From Last 30 days" color="#57c4f2" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
