import { useNavigate, useLocation } from "react-router";
import { useState } from "react";

const Sidemenu = ({user, menuButtons}) => {
    const [focus, setFocus] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
 
    return (
        <div className="h-full w-60 bg-primary-500 fixed left-0 mt-15">
            {user.map((e) => (
                <div key={e.id} className='flex flex-col justify-center items-center w-full h-[170px] t gap-3'>
                    <p className='text-white text-[20px] font-medium'>{e.name}</p>
                    <p className='text-white'>{e.email}</p>
                    <p className='text-white font-bold mt-5'>{e.role.toUpperCase()}</p>
                </div>
            ))}
            <div className="flex flex-col gap-4 h-full w-full mt-10 px-6">
                {menuButtons.map((e, index) => (
                    <button 
                        key={index} 
                        onClick={() => navigate(menuButtons.path)}
                        className={`h-11 w-full bg-primary text-white rounded-md hover:bg-light hover:text-primary-500 
                                   font-medium cursor-pointer ${location.pathname === menuButtons.path && 'bg-light'}`}>
                        {e.menu}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Sidemenu;
