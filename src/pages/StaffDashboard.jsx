import { useUser } from "../components/UserContext";
import Header from "../layouts/Header";

const StaffDashboard = () => {
    const { user } = useUser();

    return (
        <>
            {user && (
                <div>
                    <Header />
                </div>
            )}
        </>
    );
}

export default StaffDashboard;
