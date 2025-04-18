import Header from "../layouts/Header";
import AdminSidemenu from "../layouts/AdminSidemenu";
import Breadcrumb from "../components/Breadcrumb";
import Footer from "../layouts/Footer";
import UsersTable from "../components/UsersTable";

const UsersPage = () => {

    return (
        <div className="flex h-full w-full">
        <AdminSidemenu />
        <div className="h-full w-full scrollbar-thin overflow-y-auto">
            <Header />
            <div className="flex flex-col w-full h-fit gap-5">
                <Breadcrumb />
                <div className="h-full w-full px-5">
                    <UsersTable />
                </div>
                <Footer />
            </div>
        </div>
    </div>
    );
}

export default UsersPage;
