import Header from "../layouts/Header";
import Sidemenu from "../layouts/Sidemenu";
import { dummyUser, adminSidemenuBtn, sampleOverview } from '../components/Dummy'; 
import Card from "../components/Card";

const AdminDashboard = () => {

    return (
        <div className="h-screen">
            <Header />
            <div className="flex w-[98%]">
                <Sidemenu user={dummyUser} menuButtons={adminSidemenuBtn} />
                <div className="ml-65 mt-[75px] grid grid-cols-4 w-full gap-5">
                    <Card content={sampleOverview} />
                    <div className="bg-primary h-full w-full">

                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
