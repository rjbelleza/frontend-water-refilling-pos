import Header from "../layouts/Header";
import AdminSidemenu from "../layouts/AdminSidemenu";
import Breadcrumb from "../components/Breadcrumb";
import InventoryTable from "../components/InventoryTable";
import StaffSidemenu from "../layouts/StaffSidemenu";
import Footer from "../layouts/Footer";
import { useAuth } from "../contexts/AuthContext";

const InventoryPage = () => {
    const { user } = useAuth();

    return (
        <div className="flex h-full w-full">
            {user?.role == "admin" ? (
                <AdminSidemenu />
            ) : (
                <StaffSidemenu />
            )}
            <div className="h-full w-full overflow-auto">
                <Header />
                <div className="flex flex-col w-full h-fit gap-5">
                    <Breadcrumb />
                    <div className="h-full w-full px-5">
                        <InventoryTable />
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default InventoryPage;
