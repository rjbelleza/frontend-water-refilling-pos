import Header from "../layouts/Header";
import AdminSidemenu from "../layouts/AdminSidemenu";
import Breadcrumb from "../components/Breadcrumb";
import CreateTransaction from "../components/CreateTransaction";
import StaffSidemenu from "../layouts/StaffSidemenu";
import Footer from "../layouts/Footer";
import { useAuth } from "../contexts/AuthContext";


const NewSalesPage = () => {
    const { user } = useAuth();

    return (
        <div className="flex h-full w-full">
            {user?.role == "admin" ? (
                <AdminSidemenu />
            ) : (
                <StaffSidemenu />
            )}
            <div className="h-full w-full scrollbar-thin overflow-y-auto">
                <Header />
                <div className="flex flex-col w-full h-fit gap-5">
                    <Breadcrumb />
                    <div className="h-full w-full px-5 py-5">
                        <CreateTransaction />
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default NewSalesPage;
