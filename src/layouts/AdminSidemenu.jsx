import { Link } from "react-router-dom";
import { PhilippinePeso } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminSidemenu = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        if (!loading && !user) {
            navigate('/');
        }
    }, [user, loading, navigate]);


    if (loading || !user) {
        return <p>Loading...</p>;
    }


    return (
        <div className="flex h-full w-60 bg-[url('/images/sidemenu.png')] bg-cover bg-center mt-2 rounded-tr-md
                        shadow-[2px_0px_10px_gray] bg-opacity-30 fixed left-0 justify-center p-5"
        >
            <div className="flex flex-col gap-1 h-fit w-50 rounded-lg">
                <div className="flex flex-col items-center w-full">
                    <p className="text-[13px] text-gray-600 mb-1">Welcome,</p>
                    <p className="font-bold text-[20px]">{user.name}</p>
                    <p className="w-full text-center text-blue-700 font-mono text-[20px] mt-3 bg-gray-300 rounded-xl p-1">
                        {"admin".toLocaleUpperCase()}
                    </p>
                </div>
                <div className="h-fit w-full mt-12">
                    <p className="font-bold text-[13px] text-gray-600 mb-3">Menus</p>
                    <SideMenuBtn />
                </div>
            </div>
        </div>
    );
}

const SideMenuBtn = () => {


    return (
        <div className="flex flex-col gap-3 w-full text-white font-light">
            <Link to="/admin-dashboard">
                <button className="flex items-center gap-3 h-11 w-full bg-primary-500 rounded-tr-full
                                rounded-br-full cursor-pointer hover:bg-sky-950 hover:scale-103 transition-all">
                    <div className="h-full w-2 bg-indigo-500"></div>
                    <div className="flex justify-between w-full">
                        <p>Dashboard</p>
                        <img src="src/assets/icons/dashboard.png" className="h-7 bg-indigo-500 rounded-full mr-3 p-1" />
                    </div>
                </button>
            </Link>

            <Link to="/admin-sales">
                <button className="flex items-center gap-3 h-11 w-full bg-primary-500 rounded-tr-full
                                rounded-br-full cursor-pointer hover:bg-sky-950 hover:scale-103 transition-all">
                    <div className="h-full w-2 bg-purple-500"></div>
                    <div className="flex justify-between w-full">
                        <p>Sales</p>
                        <PhilippinePeso size={28} className="bg-purple-500 rounded-full mr-3 p-1" />
                    </div>
                </button>
            </Link>

            <button className="flex items-center gap-3 h-11 w-full bg-primary-500 rounded-tr-full
                               rounded-br-full cursor-pointer hover:bg-sky-950 hover:scale-103 transition-all">
                <div className="h-full w-2 bg-violet-500"></div>
                <div className="flex justify-between w-full">
                    <p>Inventory</p>
                    <img src="src/assets/icons/inventory.png" className="h-7 bg-violet-500 rounded-full mr-3 p-1" />
                </div>
            </button>
            <button className="flex items-center gap-3 h-11 w-full bg-primary-500 rounded-tr-full
                               rounded-br-full cursor-pointer hover:bg-sky-950 hover:scale-103 transition-all">
                <div className="h-full w-2 bg-pink-500"></div>
                <div className="flex justify-between w-full">
                    <p>Expenses</p>
                    <img src="src/assets/icons/expenses.png" className="h-7 bg-pink-500 rounded-full mr-3 p-1" />
                </div>
            </button>
            <button className="flex items-center gap-3 h-11 w-full bg-primary-500 rounded-tr-full
                               rounded-br-full cursor-pointer hover:bg-sky-950 hover:scale-103 transition-all">
                <div className="h-full w-2 bg-rose-500"></div>
                <div className="flex justify-between w-full">
                    <p>Reports</p>
                    <img src="src/assets/icons/reports.png" className="h-7 bg-rose-500 rounded-full mr-3 p-1" />
                </div>
            </button>
            <button className="flex items-center gap-3 h-11 w-full bg-primary-500 rounded-tr-full
                               rounded-br-full cursor-pointer hover:bg-sky-950 hover:scale-103 transition-all">
                <div className="h-full w-2 bg-slate-500"></div>
                <div className="flex justify-between w-full">
                    <p>Users</p>
                    <img src="src/assets/icons/users.png" className="h-7 bg-slate-500 rounded-full mr-3 p-1" />
                </div>
            </button>
        </div>
    );
}

export default AdminSidemenu;
