
const AdminSidemenu = () => {
    const user = {name: 'Jack Frost', email: 'jack@gmail.com', role: 'admin'};

    return (
        <div className="flex h-full w-60 bg-[url('/images/sidemenu.png')] bg-cover bg-center mt-2 rounded-tr-md
                        shadow-[2px_0px_10px_gray] bg-opacity-30 fixed left-0 justify-center p-5"
        >
            <div className="flex flex-col gap-1 h-fit w-50 rounded-lg">
                <div className="flex flex-col items-center w-full">
                    <p className="text-[13px] text-gray-600 mb-1">Welcome,</p>
                    <p className="font-bold text-[20px]">{user.name}</p>
                    <p className="w-full text-center text-blue-700 font-mono text-[20px] mt-3 bg-gray-300 rounded-xl p-1">
                        {user.role.toLocaleUpperCase()}
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
            <button className="flex items-center gap-3 h-11 w-full bg-primary-500 rounded-tr-full
                               rounded-br-full cursor-pointer hover:bg-primary hover:scale-103 transition-all">
                <div className="h-full w-2 bg-indigo-800"></div>
                <p>Dashboard</p>
            </button>
            <button className="flex items-center gap-3 h-11 w-full bg-primary-500 cursor-pointer
                               rounded-tr-full rounded-br-full hover:bg-primary hover:scale-103 transition-all">
                <div className="h-full w-2 bg-violet-500"></div>
                <p>Sales</p>
            </button>
            <button className="flex items-center gap-3 h-11 w-full bg-primary-500 cursor-pointer
                               rounded-tr-full rounded-br-full hover:bg-primary hover:scale-103 transition-all">
                <div className="h-full w-2 bg-pink-500"></div>
                <p>Inventory</p>
            </button>
            <button className="flex items-center gap-3 h-11 w-full bg-primary-500 cursor-pointer
                               rounded-tr-full rounded-br-full hover:bg-primary hover:scale-103 transition-all">
                <div className="h-full w-2 bg-rose-500"></div>
                <p>Transactions</p>
            </button>
            <button className="flex items-center gap-3 h-11 w-full bg-primary-500 cursor-pointer
                               rounded-tr-full rounded-br-full hover:bg-primary hover:scale-103 transition-all">
                <div className="h-full w-2 bg-slate-600"></div>
                <p>Users</p>
            </button>
        </div>
    );
}

export default AdminSidemenu;
