import { useUser } from "../components/UserContext";

const StaffDashboard = () => {
    const { user } = useUser();

    return (
        <>
            {user && (
                <p>Welcome, {user.name}!</p>
            )}
        </>
    );
}

export default StaffDashboard;
