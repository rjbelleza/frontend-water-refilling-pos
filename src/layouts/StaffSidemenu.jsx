import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, HandCoins, Package } from 'lucide-react';

const StaffSidemenu = () => {
    const { user, loading, close, isClose, setIsClose } = useAuth();
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
        location.pathname === "/new-sales" && setIsClose(false);
    }, [])


    if (loading || !user) {
        return <p>Loading...</p>;
    }


    return (
        <div className={`${isClose ? 'w-60 p-5' : 'w-20 pt-5'} h-screen flex flex-col bg-[url('/images/sidemenu.png')] bg-cover bg-center
                bg-opacity-30 sticky left-0 items-center transition-all ease-in-out border border-gray-400`}
        >
            <div className={`${!isClose ? 'justify-center' : 'justify-end'} flex w-full`}>
                <button 
                    className='cursor-pointer hover:bg-sky-500 rounded-md p-1 transition-all'
                    onClick={() => close()}
                >
                    <Menu size={30} className='text-primary' />
                </button>
            </div>
            <div className={`${!isClose && 'hidden'} flex flex-col gap-1 h-fit w-50 rounded-lg mt-3`}>
                <div className="flex flex-col items-center w-full">
                    <p className="text-[13px] text-gray-600 mb-1">Welcome,</p>
                    <p className="font-bold text-[20px]">{`${user.fname} ${user.lname}`}</p>
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
            {!isClose && (
                    <div
                        className="flex flex-col text-white items-center gap-5 h-full w-3/4 mt-20"
                    >
                        <Link to="/sales"
                            className="flex justify-center items-center gap-3 h-11 w-3/4 bg-primary-500 rounded-full
                                    rounded-br-full cursor-pointer hover:bg-sky-950 hover:scale-103 transition-all"
                        >
                            <HandCoins />
                        </Link>
        
                        <Link to="/inventory"
                            className="flex justify-center items-center gap-3 h-11 w-3/4 bg-primary-500 rounded-full
                                    rounded-br-full cursor-pointer hover:bg-sky-950 hover:scale-103 transition-all"
                        >
                            <Package />
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
                <div className="h-full w-2 bg-blue-700"></div>
                <div className="flex justify-between w-full">
                    <p>Sales</p>
                    <HandCoins className='mr-3' />
                </div>
            </Link>

            <Link to="/inventory" 
                className="flex items-center gap-3 h-11 w-full bg-primary-500 rounded-tr-full
                               rounded-br-full cursor-pointer hover:bg-sky-950 hover:scale-103 transition-all">
                <div className="h-full w-2 bg-blue-700"></div>
                <div className="flex justify-between w-full">
                    <p>Inventory</p>
                    <Package className='mr-3' />
                </div>
            </Link>
        </div>
    );
}

export default StaffSidemenu;
