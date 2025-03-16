import Header from "../layouts/Header";
import Card from "../components/Card";
import LineChart from "../components/SalesOverview";
import PieChart from "../components/PieChart";
import AdminSidemenu from "../layouts/AdminSidemenu";
import { sampleOverview } from "../components/Dummy";
import { useUser } from "../components/UserContext";


const AdminDashboard = () => {
    const { user } = useUser();

    return (
        <div className="h-screen">
            <Header /> 
            <div className="flex w-[98%]">
                <AdminSidemenu user={user} />
                <div className="ml-65 mt-[75px] grid grid-cols-4 w-full gap-5">
                    <Card content={sampleOverview} />
                    <div className="bg-white h-full w-full col-span-3 rounded-xl">
                        <LineChart />
                    </div>
                    <div className="flex items-center w-full h-full">
                        <PieChart />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
