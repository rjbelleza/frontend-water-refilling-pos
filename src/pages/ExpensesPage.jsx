import Header from "../layouts/Header";
import AdminSidemenu from "../layouts/AdminSidemenu";
import Breadcrumb from "../components/Breadcrumb";
import ExpensesTable from "../components/ExpensesTable";
import StaffSidemenu from "../layouts/StaffSidemenu";
import Footer from "../layouts/Footer";
import { useAuth } from "../contexts/AuthContext";

const ExpensesPage = () => {
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
                <div className="flex flex-col w-full h-fit">
                    <Breadcrumb />
                    {isClose && (
                        <div 
                            className="block md:hidden h-full w-full fixed bg-white z-8"
                        />
                    )}
                    <div className="h-full w-full px-5 mb-25 md:mb-5">
                        <ExpensesTable />
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default ExpensesPage;
