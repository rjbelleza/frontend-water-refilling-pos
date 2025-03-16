import Header from "../layouts/Header";
import TransactionTable from "../components/TransactionTable";
import AdminSidemenu from "../layouts/AdminSidemenu";
import { useUser } from "../components/UserContext";


const Transaction = () => {
    const { user } = useUser();

    return (
        <div className="h-screen">
            <Header /> 
            <div className="flex w-[98%]">
                <AdminSidemenu user={user} />
                <div className="ml-65 mt-[75px] w-full">
                    <TransactionTable />
                </div> 
            </div>
        </div>
    );
}

export default Transaction;
