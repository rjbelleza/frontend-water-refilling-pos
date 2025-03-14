import Header from "../layouts/Header";
import Sidemenu from "../layouts/Sidemenu";
import { dummyUser, adminSidemenuBtn } from '../components/Dummy'; 

const AdminDashboard = () => {

    return (
        <div className="h-screen">
            <Header />
            <Sidemenu user={dummyUser} menuButtons={adminSidemenuBtn} />
            
        </div>
    );
}

export default AdminDashboard;
