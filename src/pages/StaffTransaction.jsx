import Header from "../layouts/Header";
import TransactionTable from "../components/TransactionTable";
import StaffSidemenu from "../layouts/StaffSidemenu";
import { useUser } from "../components/UserContext";


const StaffTransaction = () => {
    const { user } = useUser();

    return (
        <div className="h-screen">
            <Header /> 
            <div className="flex w-[98%]">
                <StaffSidemenu user={user} />
                <div className="ml-65 mt-[75px] w-full">
                    <TransactionTable />
                </div> 
            </div>
        </div>
    );
}

export default StaffTransaction;
