import Header from "../layouts/Header";
import ReportsTable from "../components/ReportsTable";
import AdminSidemenu from "../layouts/AdminSidemenu";
import { user } from "../pages/AdminDashboard";

const Reports = () => {

    return (
        <div className="h-screen">
            <Header /> 
            <div className="flex w-[98%]">
                <AdminSidemenu user={user} />
                <div className="ml-65 mt-[75px] w-full">
                    <ReportsTable />
                </div>
            </div>
        </div>
    );
}

export default Reports;
