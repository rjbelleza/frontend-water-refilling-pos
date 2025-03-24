import Header from "../layouts/Header";
import AdminSidemenu from "../layouts/AdminSidemenu";
import Breadcrumb from "../components/Breadcrumb";
import CreateTransaction from "../components/CreateTransaction";


const NewSalesPage = () => {

    return (
        <div className="h-screen w-full bg-gray-300 overflow-hidden">
            <Header />
            <div className="flex h-fit w-full mt-15">
                <AdminSidemenu />
                <div className="h-full w-full ml-63 mt-2 mr-2 rounded-md">
                    <Breadcrumb />
                    <div className="grid grid-cols-1 h-screen w-full bg-white mt-2 rounded-md p-5">
                        <CreateTransaction />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewSalesPage;
