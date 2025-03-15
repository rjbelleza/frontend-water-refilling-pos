import Header from "../layouts/Header";
import Sidemenu from "../layouts/Sidemenu";
import { dummyUser, adminSidemenuBtn } from '../components/Dummy'; 
import UserListTable from "../components/UserListTable";

const UserList = () => {

    return (
        <div className="h-screen">
            <Header /> 
            <div className="flex w-[98%]">
                <Sidemenu user={dummyUser} menuButtons={adminSidemenuBtn} />
                <div className="ml-65 mt-[75px] w-full">
                    <UserListTable />
                </div>
            </div>
        </div>
    );
}

export default UserList;
