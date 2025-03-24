import Header from "../layouts/Header";
import AdminSidemenu from "../layouts/AdminSidemenu";
import Breadcrumb from "../components/Breadcrumb";


const NewSalesPage = () => {

    return (
        <div className="h-screen w-full bg-gray-300 scroll-smooth">
            <Header />
            <div className="flex h-fit w-full mt-15">
                <AdminSidemenu />
                <div className="h-full w-full ml-63 mt-2 mr-2 rounded-md">
                    <Breadcrumb />
                    <div className="grid grid-cols-1 h-[600px] w-full bg-white mt-2 rounded-md p-5">
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewSalesPage;
