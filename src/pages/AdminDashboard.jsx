import Header from "../layouts/Header";
import Sidemenu from "../layouts/Sidemenu";
import { dummyUser, adminSidemenuBtn, sampleOverview } from '../components/Dummy'; 
import Card from "../components/Card";

const AdminDashboard = () => {

    return (
        <div className="h-screen">
            <Header />
            <div className="flex w-full">
                <Sidemenu user={dummyUser} menuButtons={adminSidemenuBtn} />
                <div className="ml-65 mt-[70px] grid grid-cols-4 w-full">
                    <Card content={sampleOverview} />
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
