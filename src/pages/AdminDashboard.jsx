import Header from "../layouts/Header";
import AdminSidemenu from "../layouts/AdminSidemenu";
import Breadcrumb from "../components/Breadcrumb";

const AdminDashboard = () => {

    return (
        <div className="h-screen bg-gray-300 scroll-smooth">
            <Header />
            <div className="flex h-full w-full mt-15">
                <AdminSidemenu />
                <div className="h-full w-full ml-63 mt-2 mr-2 rounded-md">
                    <Breadcrumb />
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
