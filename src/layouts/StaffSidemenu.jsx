import { PhilippinePeso } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu } from 'lucide-react';

const StaffSidemenu = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);


    const toggleMenu = () => setIsOpen(!isOpen);


    useEffect(() => {
        if (!loading && !user) {
            navigate('/');
        }
    }, [user, loading]);


    useEffect(() => {
        location.pathname == "/new-sales" && setIsOpen(false);
    }, [])


    if (loading || !user) {
        return <p>Loading...</p>;
    }


    return (
        <div className={`${isOpen ? 'w-60' : 'w-20'} flex flex-col bg-[url('/images/sidemenu.png')] bg-cover bg-center mt-2 rounded-tr-md
                        shadow-[2px_0px_10px_gray] bg-opacity-30 sticky left-0 items-center p-3 transition-all ease-in-out`}
        >
            <div className={`${!isOpen ? 'justify-center' : 'justify-end'} flex w-full`}>
                <button 
                    className='cursor-pointer hover:bg-sky-500 rounded-md p-1 transition-all'
                    onClick={toggleMenu}
                >
                    <Menu size={30} className='text-primary' />
                </button>
            </div>
            <div className={`${!isOpen && 'hidden'} flex flex-col gap-1 h-fit w-50 rounded-lg mt-3`}>
                <div className="flex flex-col items-center w-full">
                    <p className="text-[13px] text-gray-600 mb-1">Welcome,</p>
                    <p className="font-bold text-[20px]">{user.name}</p>
                    <p className="w-full text-center text-blue-700 font-mono text-[20px] mt-3 bg-gray-300 rounded-xl p-1">
                        {user.role ? user.role.toLocaleUpperCase() : "ADMIN"}
                    </p>
                </div>
                <div className="h-full w-full mt-12">
                    <p className="font-bold text-[13px] text-gray-600 mb-3">Menus</p>
                    <SideMenuBtn />
                </div>
            </div>

            {/* Decreased Sidemenu width*/}
            {!isOpen && (
                    <div
                        className="flex flex-col gap-5 h-full mt-20"
                    >
                        <Link to="/sales"
                            className="flex justify-center items-center gap-3 h-11 w-full bg-primary-500 rounded-tr-full
                                    rounded-br-full cursor-pointer hover:bg-sky-950 hover:scale-103 transition-all"
                        >
                            <div className="h-full w-2 bg-purple-500"></div>
                            <PhilippinePeso size={28} color='white' className="bg-purple-500 rounded-full mr-3 p-1" />
                        </Link>
        
                        <Link to="/inventory"
                            className="flex justify-center items-center gap-3 h-11 w-full bg-primary-500 rounded-tr-full
                                    rounded-br-full cursor-pointer hover:bg-sky-950 hover:scale-103 transition-all"
                        >
                            <div className="h-full w-2 bg-violet-500"></div>
                            <div className="flex justify-between w-full">
                                <img src="/icons/inventory.png" className="h-7 bg-violet-500 rounded-full mr-3 p-1" />
                            </div>
                        </Link>
        
                        <Link to="/expenses"
                            className="flex justify-center items-center gap-3 h-11 w-full bg-primary-500 rounded-tr-full
                                    rounded-br-full cursor-pointer hover:bg-sky-950 hover:scale-103 transition-all"
                        >
                            <div className="h-full w-2 bg-pink-500"></div>
                            <div className="flex justify-between w-full">
                                <img src="/icons/expenses.png" className="h-7 bg-pink-500 rounded-full mr-3 p-1" />
                            </div>
                        </Link>    
                    </div>
            )}
        </div>
    );
}

const SideMenuBtn = () => {


    return (
        <div className="flex flex-col gap-3 h-full w-full text-white font-light">
            <Link to="/sales"
                  className="flex items-center gap-3 h-11 w-full bg-primary-500 rounded-tr-full
                             rounded-br-full cursor-pointer hover:bg-sky-950 hover:scale-103 transition-all"
            >
                <div className="h-full w-2 bg-purple-500"></div>
                <div className="flex justify-between w-full">
                    <p>Sales</p>
                    <PhilippinePeso size={28} className="bg-purple-500 rounded-full mr-3 p-1" />
                </div>
            </Link>

            <Link to="/inventory" 
                className="flex items-center gap-3 h-11 w-full bg-primary-500 rounded-tr-full
                               rounded-br-full cursor-pointer hover:bg-sky-950 hover:scale-103 transition-all">
                <div className="h-full w-2 bg-violet-500"></div>
                <div className="flex justify-between w-full">
                    <p>Inventory</p>
                    <img src="/icons/inventory.png" className="h-7 bg-violet-500 rounded-full mr-3 p-1" />
                </div>
            </Link>

            <Link to="/expenses" 
                className="flex items-center gap-3 h-11 w-full bg-primary-500 rounded-tr-full
                               rounded-br-full cursor-pointer hover:bg-sky-950 hover:scale-103 transition-all">
                <div className="h-full w-2 bg-pink-500"></div>
                <div className="flex justify-between w-full">
                    <p>Expenses</p>
                    <img src="/icons/expenses.png" className="h-7 bg-pink-500 rounded-full mr-3 p-1" />
                </div>
            </Link>
        </div>
    );
}

export default StaffSidemenu;
