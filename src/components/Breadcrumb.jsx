import { useLocation } from "react-router-dom";

const Breadcrumb = () => {
    const location = useLocation();

    const handleCurrentLoc = () => {
        if(location.pathname === '/admin-dashboard') {
            return 'DASHBOARD'
        }
    }

    return (
        <div className="flex items-center h-13 w-full bg-primary text-white rounded-md sticky top-17">
            <p className="ml-10 text-[17px]">{handleCurrentLoc()}</p>
        </div>
    );
}

export default Breadcrumb;
