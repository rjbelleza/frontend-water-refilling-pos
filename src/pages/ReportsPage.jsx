import Header from "../layouts/Header";
import AdminSidemenu from "../layouts/AdminSidemenu";
import Breadcrumb from "../components/Breadcrumb";
import Footer from "../layouts/Footer";
import ReportsTable from "../components/ReportsTable";
import { useAuth } from "../contexts/AuthContext";

const ReportsPage = () => {
    const { isClose } = useAuth();

    return (
        <div className="flex h-full w-full">
            <AdminSidemenu />
            <div className="h-full w-full scrollbar-thin overflow-y-auto">
                <Header />
                <div className="flex flex-col w-full h-fit gap-5">
                    <Breadcrumb />
                    {isClose && (
                        <div 
                            className="block md:hidden h-full w-full fixed bg-white z-8"
                        />
                    )}
                    <div className="h-full w-full px-5">
                        <ReportsTable />
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default ReportsPage;
