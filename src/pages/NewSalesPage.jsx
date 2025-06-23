import Header from "../layouts/Header";
import AdminSidemenu from "../layouts/AdminSidemenu";
import Breadcrumb from "../components/Breadcrumb";
import CreateTransaction from "../components/CreateTransaction";
import StaffSidemenu from "../layouts/StaffSidemenu";
import { useAuth } from "../contexts/AuthContext";


const NewSalesPage = () => {
    const { user, isClose } = useAuth();

    return (
        <div className="flex h-full w-full">
            {user?.role == "admin" ? (
                <AdminSidemenu />
            ) : (
                <StaffSidemenu />
            )}
            <div className="h-full w-full overflow-hidden bg-gray-200 scrollbar-thin overflow-y-auto">
                <Header />
                <div className="flex flex-col h-full w-full gap-5">
                    <Breadcrumb />
                    {isClose && (
                        <div 
                            className="block md:hidden h-full w-full fixed bg-white z-8"
                        />
                    )}
                    <div className="w-full h-full px-5">
                        <CreateTransaction />
                    </div>
                </div>
            </div>  
        </div>
    );
}

export default NewSalesPage;
