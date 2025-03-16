import Header from "../layouts/Header"; 
import InventoryTable from "../components/InventoryTable";
import StaffSidemenu from "../layouts/StaffSidemenu";
import { useUser } from "../components/UserContext";


const StaffInventory = () => {
    const { user } = useUser();

    return (
        <div className="h-screen">
            <Header /> 
            <div className="flex w-[98%]">
                <StaffSidemenu user={user} />
                <div className="ml-65 mt-[75px] w-full">
                    <InventoryTable />
                </div>
            </div>
        </div>
    );
}

export default StaffInventory;   
