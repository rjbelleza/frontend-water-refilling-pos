import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, HandCoins, Package, Wallet } from 'lucide-react';

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

    const handleFocus = (currPage) => {
        if(location.pathname == currPage) {
            return "bg-primary-500";
        } else {
            return "bg-primary";
        }
    };


    return (
         <div className={`${isClose ? 'w-60 p-5' : 'w-20 pt-5'} h-screen flex flex-col bg-[url('/images/bgbg.png')] bg-cover bg-center
                                 bg-opacity-30 sticky left-0 items-center transition-all ease-in-out border border-gray-400 overflow-y-auto overflow-x-hidden scrollbar-thin`}
         >
            <div className={`${!isClose ? 'justify-center' : 'justify-end'} flex w-full`}>
                <button 
                    className='cursor-pointer hover:bg-primary-100 rounded-md p-1 transition-all'
                    onClick={() => close()}
                >
                    <Menu size={30} className='text-primary hover:text-white' />
                </button>
            </div>
            <div className={`${!isClose && 'hidden'} flex flex-col gap-1 h-fit w-50 rounded-lg mt-3 px-2`}>
                <div className="flex flex-col items-center w-full">
                    <p className="text-[11px] text-gray-600 mb-1">Welcome,</p>
                    <p className="font-bold text-[17px]">{user.fname} {user.lname}</p>
                    <p className="w-full text-center text-primary font-mono text-[17px] mt-3 bg-gray-300 rounded-xl p-1">
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
                        <Link to="/new-sales"
                            className={`flex justify-center items-center gap-3 h-11 w-3/4 ${handleFocus("/new-sales")} rounded-full
                                    rounded-br-full cursor-pointer hover:bg-sky-950 hover:scale-103 transition-all`}
                        >
                            <Wallet />
                        </Link>

                        <Link to="/sales"
                            className={`flex justify-center items-center gap-3 h-11 w-3/4 ${handleFocus("/sales")} rounded-full
                                    rounded-br-full cursor-pointer hover:bg-sky-950 hover:scale-103 transition-all`}
                        >
                            <HandCoins />
                        </Link>
        
                        <Link to="/inventory"
                            className={`flex justify-center items-center gap-3 h-11 w-3/4 ${handleFocus("/inventory")} rounded-full
                                    rounded-br-full cursor-pointer hover:bg-sky-950 hover:scale-103 transition-all`}
                        >
                            <Package />
                        </Link>    
                    </div>
            )}
        </div>
    );
}

const SideMenuBtn = () => {

    const location = useLocation();

    const handleFocus = (currPage) => {
        if(location.pathname == currPage) {
            return "bg-primary-500";
        } else {
            return "bg-primary";
        }
    };

    return (
        <div className="flex flex-col h-full w-full text-white font-medium">
             <Link to="/new-sales" 
                  className={`flex items-center ${handleFocus("/new-sales")} gap-3 xl:h-10 2xl:h-11 lg:text-[14px] w-full rounded-tr-full
                                rounded-br-full cursor-pointer hover:bg-primary-100 hover:scale-103 transition-all mb-3`}
            >
                <div className="h-full w-2 bg-primary-500"></div>
                <div className="flex justify-between w-full">
                    <p>New Sale</p>
                    <Wallet className='mr-3' />
                </div>
            </Link>

            <Link to="/sales" 
                  className={`flex items-center ${handleFocus("/sales")} gap-3 xl:h-10 2xl:h-11 lg:text-[14px] w-full rounded-tr-full
                                rounded-br-full cursor-pointer hover:bg-primary-100 hover:scale-103 transition-all mb-3`}
            >
                <div className="h-full w-2 bg-primary-500"></div>
                <div className="flex justify-between w-full">
                    <p>Sales</p>
                    <HandCoins className='mr-3' />
                </div>
            </Link>

            <Link to="/inventory" 
                  className={`flex items-center ${handleFocus("/inventory")} gap-3 xl:h-10 2xl:h-11 lg:text-[14px] w-full rounded-tr-full
                                rounded-br-full cursor-pointer hover:bg-primary-100 hover:scale-103 transition-all mb-3`}
            >
                <div className="h-full w-2 bg-primary-500"></div>
                <div className="flex justify-between w-full">
                    <p>Products</p>
                    <Package className='mr-3' />
                </div>
            </Link>
        </div>
    );
}

export default StaffSidemenu;
