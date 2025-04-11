import Header from "../layouts/Header";
import AdminSidemenu from "../layouts/AdminSidemenu";
import Breadcrumb from "../components/Breadcrumb";
import InventoryTable from "../components/InventoryTable";
import StaffSidemenu from "../layouts/StaffSidemenu";
import { useAuth } from "../contexts/AuthContext";

const InventoryPage = () => {
    const { user } = useAuth();

    return (
        <div className="h-full w-full scroll-smooth">
            <Header />
            <div className="flex h-full w-full fixed top-15">
            {user?.role == "admin" ? (
                    <AdminSidemenu />
                ) : (
                    <StaffSidemenu />
                )}
                <div className="h-full w-full ml-3 mt-2 mr-2 rounded-md">
                    <Breadcrumb />
                    <div className="h-full w-full bg-white mt-2 rounded-md p-5">
                        <InventoryTable />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InventoryPage;
