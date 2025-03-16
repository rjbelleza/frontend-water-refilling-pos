import { useNavigate, useLocation } from "react-router";

const AdminSidemenu = ({user}) => {

    return (
        <div className="h-full w-60 bg-primary-500 fixed left-0 mt-15">
            <div className='flex flex-col justify-center items-center w-full h-[170px] t gap-3'>
                <p className='text-white text-[20px] font-medium'>{user.name}</p>
                <p className='text-white'>{user.email}</p>
                <p className='text-white font-bold mt-5'>{user.role.toUpperCase()}</p>
            </div>
            <div className="flex flex-col gap-4 h-full w-full mt-10 px-6">
                <MenuButtons />
            </div>
        </div>
    );
}

const MenuButtons = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const focus = {
                    focused: "bg-light text-primary-500", 
                    unfocused: "bg-primary text-white"
                  };

    return (
        <>
            <button 
                onClick={() => navigate("/admin-dashboard")}
                className={`h-11 w-full rounded-md hover:bg-light hover:text-primary-500 
                            font-medium cursor-pointer transition-all ease-in-out
                            ${location.pathname === "/admin-dashboard" ? focus.focused : focus.unfocused}
                         `}
                >Dashboard
            </button>
            <button 
                onClick={() => navigate("/reports")}
                className={`h-11 w-full rounded-md hover:bg-light hover:text-primary-500 
                            font-medium cursor-pointer transition-all ease-in-out
                            ${location.pathname === "/reports" ? focus.focused : focus.unfocused}
                         `}
                >Reports
            </button>
            <button 
                onClick={() => navigate("/inventory")}
                className={`h-11 w-full rounded-md hover:bg-light hover:text-primary-500 
                            font-medium cursor-pointer transition-all ease-in-out
                            ${location.pathname === "/inventory" ? focus.focused : focus.unfocused}
                         `}
                >Inventory
            </button>
            <button 
                onClick={() => navigate("/transactions")}
                className={`h-11 w-full rounded-md hover:bg-light hover:text-primary-500 
                            font-medium cursor-pointer transition-all ease-in-out
                            ${location.pathname === "/transactions" ? focus.focused : focus.unfocused}
                          `}
                >Transaction Records
            </button>
            <button 
                onClick={() => navigate("/user-list")}
                className={`h-11 w-full rounded-md hover:bg-light hover:text-primary-500 
                            font-medium cursor-pointer transition-all ease-in-out
                            ${location.pathname === "/user-list" ? focus.focused : focus.unfocused}
                          `}
                >User Management
            </button>
        </>
    );
}

export default AdminSidemenu;
