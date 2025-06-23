import Header from "../layouts/Header";
import AdminSidemenu from "../layouts/AdminSidemenu";
import Breadcrumb from "../components/Breadcrumb";
import InventoryTable from "../components/InventoryTable";
import StaffSidemenu from "../layouts/StaffSidemenu";
import Footer from "../layouts/Footer";
import { useAuth } from "../contexts/AuthContext";

const InventoryPage = () => {
    const { user, isClose } = useAuth();

    return (
        <div className="flex h-full w-full">
            {user?.role == "admin" ? (
                <AdminSidemenu />
            ) : (
                <StaffSidemenu />
            )}
            <div className="h-full w-full scrollbar-thin overflow-y-auto">
                <Header />
                <div className="flex flex-col w-full h-fit gap-3">
                    <Breadcrumb />
                    {isClose && (
                        <div 
                            className="block md:hidden h-full w-full fixed bg-white z-8"
                        />
                    )}
                    <div className="h-[800px] md:h-full w-full px-5">
                        <InventoryTable />
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default InventoryPage;
