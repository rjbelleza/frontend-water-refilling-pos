import Header from "../layouts/Header";
import Sidemenu from "../layouts/Sidemenu";
import { dummyUser, adminSidemenuBtn, sampleOverview } from '../components/Dummy'; 
import TransactionTable from "../components/TransactionTable";

const Transaction = () => {

    return (
        <div className="h-screen">
            <Header /> 
            <div className="flex w-[98%]">
                <Sidemenu user={dummyUser} menuButtons={adminSidemenuBtn} />
                <div className="ml-65 mt-[75px] w-full">
                    <TransactionTable />
                </div> 
            </div>
        </div>
    );
}

export default Transaction;
