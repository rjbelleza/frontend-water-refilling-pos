import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, CircleGauge, Coins, Package, Calculator, Users, ChartNoAxesCombined, Wallet } from 'lucide-react';

const AdminSidemenu = () => {
    const { user, loading, close, isClose, setIsClose } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();


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
                        className="flex flex-col text-white items-center h-full w-3/4 mt-20"
                    >
                        <Link to="/admin-dashboard"
                            className={`flex justify-center items-center gap-3 h-11 w-3/4 ${handleFocus("/admin-dashboard")} rounded-full
                                    rounded-br-full cursor-pointer hover:bg-primary-100 hover:scale-103 transition-all mb-5`}
                        >
                            <CircleGauge />
                        </Link>

                        <Link to="/inventory"
                            className={`flex justify-center items-center gap-3 h-11 w-3/4 ${handleFocus("/inventory")} rounded-full
                                            rounded-br-full cursor-pointer hover:bg-primary-100 hover:scale-103 transition-all mb-5`}
                        >
                            <Package />
                        </Link>

                        <Link to="/new-sales"
                            className={`flex justify-center items-center gap-3 h-11 w-3/4 ${handleFocus("/new-sales")} rounded-full
                                            rounded-br-full cursor-pointer hover:bg-primary-100 hover:scale-103 transition-all mb-5`}
                        >
                            <Wallet />
                        </Link>

                        <Link to="/sales"
                            className={`flex justify-center items-center gap-3 h-11 w-3/4 ${handleFocus("/sales")} rounded-full
                                            rounded-br-full cursor-pointer hover:bg-primary-100 hover:scale-103 transition-all mb-5`}
                        >
                            <Coins />
                        </Link>
        
                        <Link to="/expenses"
                            className={`flex justify-center items-center gap-3 h-11 w-3/4 ${handleFocus("/expenses")} rounded-full
                                            rounded-br-full cursor-pointer hover:bg-primary-100 hover:scale-103 transition-all mb-5`}
                        >
                            <Calculator />
                        </Link>
        
                        <Link to="/netProfit" 
                            className={`flex justify-center items-center gap-3 h-11 w-3/4 ${handleFocus("/netProfit")} rounded-full
                                            rounded-br-full cursor-pointer hover:bg-primary-100 hover:scale-103 transition-all mb-5`}
                        >
                            <ChartNoAxesCombined />
                        </Link>
        
                        <Link to="/users"
                            className={`flex justify-center items-center gap-3 h-11 w-3/4 ${handleFocus("/users")} rounded-full
                                            rounded-br-full cursor-pointer hover:bg-primary-100 hover:scale-103 transition-all mb-5`}
                        >
                            <Users />   
                        </Link>
        
                    </div>
            )}
        </div>
    );
}

const SideMenuBtn = () => {

    const location = useLocation();

    const handleFocus = (currPage) => {
        if(location.pathname === currPage) {
            return "bg-primary-500";
        } else {
            return "bg-primary"
        }
    };

    return (
        <div className="flex flex-col h-full w-full text-white font-medium">
            <Link to="/admin-dashboard" 
                  className={`flex items-center ${handleFocus("/admin-dashboard")} gap-3 min-h-10 xl:h-10 2xl:h-11 lg:text-[14px] w-full rounded-tr-full
                             rounded-br-full cursor-pointer hover:bg-primary-100 hover:scale-103 transition-all mb-3`}
            >
                <div className="h-full w-2 bg-primary-500"></div>
                <div className="flex justify-between items-center w-full">
                    <p className='text-[12px]'>DASHBOARD</p>
                    <CircleGauge className='mr-3' size={20} />
                </div>
            </Link>

            <Link to="/inventory" 
                className={`flex items-center gap-3 min-h-10 xl:h-10 2xl:h-11 lg:text-[14px] w-full ${handleFocus("/inventory")} rounded-tr-full
                               rounded-br-full cursor-pointer hover:bg-primary-100 hover:scale-103 transition-all mb-3`}
            >
                <div className="h-full w-2 bg-primary-500"></div>
                <div className="flex justify-between items-center w-full">
                    <p className='text-[12px]'>PRODUCTS</p>
                    <Package className='mr-3' size={20} />
                </div>
            </Link>

            <Link to="/new-sales"
                  className={`flex items-center gap-3 min-h-10 xl:h-10 2xl:h-11 lg:text-[14px] w-full ${handleFocus("/new-sales")} rounded-tr-full
                                rounded-br-full cursor-pointer hover:bg-primary-100 hover:scale-103 transition-all mb-3`}
            >
                <div className="h-full w-2 bg-primary-500"></div>
                <div className="flex justify-between items-center w-full">
                    <p className='text-[12px]'>TRANSACTION</p>
                    <Wallet className='mr-3' size={20} />
                </div>
            </Link>

            <Link to="/sales"
                  className={`flex items-center gap-3 min-h-10 xl:h-10 2xl:h-11 lg:text-[14px] w-full ${handleFocus("/sales")} rounded-tr-full
                                rounded-br-full cursor-pointer hover:bg-primary-100 hover:scale-103 transition-all mb-3`}
            >
                <div className="h-full w-2 bg-primary-500"></div>
                <div className="flex justify-between items-center w-full">
                    <p className='text-[12px]'>SALES</p>
                    <Coins className='mr-3' size={20} />
                </div>
            </Link>

            <Link to="/expenses" 
                className={`flex items-center gap-3 min-h-10 xl:h-10 2xl:h-11 lg:text-[14px] w-full ${handleFocus("/expenses")} rounded-tr-full
                            rounded-br-full cursor-pointer hover:bg-primary-100 hover:scale-103 transition-all mb-3`}
            >
                <div className="h-full w-2 bg-primary-500"></div>
                <div className="flex justify-between items-center w-full">
                    <p className='text-[12px]'>EXPENSES</p>
                    <Calculator className='mr-3' size={20} />
                </div>
            </Link>

            <Link to="/netProfit"
                className={`flex items-center gap-3 min-h-10 xl:h-10 2xl:h-11 lg:text-[14px] w-full ${handleFocus("/netProfit")} rounded-tr-full
                                rounded-br-full cursor-pointer hover:bg-primary-100 hover:scale-103 transition-all mb-3`}
            >
                <div className="h-full w-2 bg-primary-500"></div>
                <div className="flex justify-between items-center w-full">
                    <p className='text-[12px]'>REPORTS</p>
                    <ChartNoAxesCombined className='mr-3' size={20} />
                </div>
            </Link>

            <Link to="/users" 
                className={`flex items-center gap-3 min-h-10 xl:h-10 2xl:h-11 lg:text-[14px] w-full ${handleFocus("/users")} rounded-tr-full
                                rounded-br-full cursor-pointer hover:bg-primary-100 hover:scale-103 transition-all mb-3`}
            >
                <div className="h-full w-2 bg-primary-500"></div>
                <div className="flex justify-between items-center w-full">
                    <p className='text-[12px]'>USERS</p>
                    <Users className='mr-3' size={20} />
                </div>
            </Link>
        </div>
    );
}

export default AdminSidemenu;
