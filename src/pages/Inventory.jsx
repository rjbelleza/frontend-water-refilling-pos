import Header from "../layouts/Header"; 
import InventoryTable from "../components/InventoryTable";
import AdminSidemenu from "../layouts/AdminSidemenu";
import { user } from "../pages/AdminDashboard";

const Inventory = () => {

    return (
        <div className="h-screen">
            <Header /> 
            <div className="flex w-[98%]">
                <AdminSidemenu user={user} />
                <div className="ml-65 mt-[75px] w-full">
                    <InventoryTable />
                </div>
            </div>
        </div>
    );
}

export default Inventory;   
