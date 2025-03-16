import Header from "../layouts/Header";
import UserListTable from "../components/UserListTable";
import AdminSidemenu from "../layouts/AdminSidemenu";
import { useUser } from "../components/UserContext";


const UserList = () => {
    const { user } = useUser();

    return (
        <div className="h-screen">
            <Header /> 
            <div className="flex w-[98%]">
                <AdminSidemenu user={user} />
                <div className="ml-65 mt-[75px] w-full">
                    <UserListTable />
                </div>
            </div>
        </div>
    );
}

export default UserList;
