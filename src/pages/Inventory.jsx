import Header from "../layouts/Header";
import Sidemenu from "../layouts/Sidemenu";
import { dummyUser, adminSidemenuBtn, sampleOverview } from '../components/Dummy'; 
import InventoryTable from "../components/InventoryTable";

const Inventory = () => {

    return (
        <div className="h-screen">
            <Header /> 
            <div className="flex w-[98%]">
                <Sidemenu user={dummyUser} menuButtons={adminSidemenuBtn} />
                <div className="ml-65 mt-[75px] w-full">
                    <InventoryTable />
                </div>
            </div>
        </div>
    );
}

export default Inventory;   
