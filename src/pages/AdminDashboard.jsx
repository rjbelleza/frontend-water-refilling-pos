import Header from "../layouts/Header";
import AdminSidemenu from "../layouts/AdminSidemenu";

const AdminDashboard = () => {

    return (
        <div className="h-screen bg-gray-300 scroll-smooth">
            <Header />
            <div className="flex h-full w-full mt-15">
                <AdminSidemenu />
            </div>
        </div>
    );
}

export default AdminDashboard;
