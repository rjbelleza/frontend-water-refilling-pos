import Header from "../layouts/Header";
import AdminSidemenu from "../layouts/AdminSidemenu";
import Breadcrumb from "../components/Breadcrumb";
import CreateTransaction from "../components/CreateTransaction";
import StaffSidemenu from "../layouts/StaffSidemenu";
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
            <div className="h-full w-full scrollbar-thin overflow-y-auto bg-gray-200">
                <Header />
                <div className="flex flex-col h-full w-full gap-5">
                    <Breadcrumb />
                    <div className="w-full h-full px-5">
                        <CreateTransaction />
                    </div>
                </div>
            </div>  
        </div>
    );
}

export default NewSalesPage;
