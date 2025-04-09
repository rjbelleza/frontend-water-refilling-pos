import { useLocation } from "react-router";

const Breadcrumb = () => {
    const location = useLocation();

    const handleCurrentLoc = () => {
        if(location.pathname === '/admin-dashboard') {
            return 'DASHBOARD'
        }
        else if (location.pathname === '/admin-sales') {
            return 'SALES MANAGEMENT'
        }
        else if (location.pathname === '/new-sales') {
            return 'SALES MANAGEMENT > NEW TRANSACTION'
        }
        else if (location.pathname === '/inventory') {
            return 'INVENTORY MANAGEMENT'
        }
        else if (location.pathname === '/expenses') {
            return 'EXPENSES MANAGEMENT'
        }
    }

    return (
        <div className="flex items-center h-12 w-full bg-gray-100 text-primary rounded-tr-md rounded-br-md 
                        sticky top-0 border-l-blue-500 border-l-10 font-bold shadow-gray shadow-md z-50"
        >
            <p className="ml-10 text-[15px]">{handleCurrentLoc()}</p>
        </div>
    );
}

export default Breadcrumb;
