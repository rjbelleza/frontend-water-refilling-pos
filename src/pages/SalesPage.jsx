import Header from "../layouts/Header";
import AdminSidemenu from "../layouts/AdminSidemenu";
import Breadcrumb from "../components/Breadcrumb";
import SalesTable from "../components/SalesTable";
import { useAuth } from "../contexts/AuthContext";
import StaffSidemenu from "../layouts/StaffSidemenu";
import Footer from "../layouts/Footer";


const SalesPage = () => {
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
                        <SalesTable />
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default SalesPage;
