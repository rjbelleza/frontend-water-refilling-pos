import Header from "../layouts/Header";
import Sidemenu from "../layouts/Sidemenu";
import { dummyUser, adminSidemenuBtn } from '../components/Dummy'; 
import ReportsTable from "../components/ReportsTable";

const Reports = () => {

    return (
        <div className="h-screen">
            <Header /> 
            <div className="flex w-[98%]">
                <Sidemenu user={dummyUser} menuButtons={adminSidemenuBtn} />
                <div className="ml-65 mt-[75px] w-full">
                    <ReportsTable />
                </div>
            </div>
        </div>
    );
}

export default Reports;
