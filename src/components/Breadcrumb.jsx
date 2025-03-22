import { useLocation } from "react-router";

const Breadcrumb = () => {
    const location = useLocation();

    const handleCurrentLoc = () => {
        if(location.pathname === '/admin-dashboard') {
            return 'DASHBOARD'
        }
    }

    return (
        <div className="flex items-center h-12 w-full bg-gray-100 text-primary rounded-tr-md rounded-br-md 
                        sticky top-17 border-l-blue-500 border-l-10 font-bold shadow-gray shadow-md">
            <p className="ml-10 text-[15px]">{handleCurrentLoc()}</p>
        </div>
    );
}

export default Breadcrumb;
