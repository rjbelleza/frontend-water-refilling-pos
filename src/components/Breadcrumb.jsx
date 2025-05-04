import { useLocation } from "react-router";

const Breadcrumb = () => {
    const location = useLocation();

    const handleCurrentLoc = () => {
        if(location.pathname === '/admin-dashboard') {
            return 'DASHBOARD'
        }
        else if (location.pathname === '/sales') {
            return 'SALES REPORTS'
        }
        else if (location.pathname === '/new-sales') {
            return 'NEW SALE'
        }
        else if (location.pathname === '/inventory') {
            return 'PRODUCT MANAGEMENT'
        }
        else if (location.pathname === '/expenses') {   
            return 'EXPENSES REPORTS'
        }
        else if (location.pathname === '/netProfit') {
            return 'PROFIT REPORTS'
        }
        else if (location.pathname === '/users') {
            return 'USER MANAGEMENT'
        }
    }

    return (
        <div className="flex items-center min-h-12 w-full bg-white text-primary sticky top-0 font-bold border-b-1 border-dashed border-gray-400 z-50">
            <p className="ml-10 text-[15px]">{handleCurrentLoc()}</p>
        </div>
    );
}

export default Breadcrumb;
