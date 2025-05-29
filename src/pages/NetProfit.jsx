import Header from "../layouts/Header";
import AdminSidemenu from "../layouts/AdminSidemenu";
import Breadcrumb from "../components/Breadcrumb";
import Footer from "../layouts/Footer";
import NetProfitTable from "../components/NetProfitTable";


const NetProfit = () => {

    return (
        <div className="flex h-full w-full">
            <AdminSidemenu />
            <div className="h-full w-full overflow-y-auto scrollbar-thin">
                <Header />
                <div className="flex flex-col w-full h-fit">
                    <Breadcrumb />
                    <div className="h-full w-full px-5 mb-5">
                        <NetProfitTable />
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default NetProfit;
