import { useNavigate, useLocation } from "react-router";

const Sidemenu = ({user, menuButtons}) => {
    const navigate = useNavigate(); 
    const location = useLocation();
 
    return (
        <div className="h-full w-60 bg-primary-500 fixed left-0 mt-15">
            <div className='flex flex-col justify-center items-center w-full h-[170px] t gap-3'>
                <p className='text-white text-[20px] font-medium'>{user.name}</p>
                <p className='text-white'>{user.email}</p>
                <p className='text-white font-bold mt-5'>{user.role.toUpperCase()}</p>
            </div>
            <div className="flex flex-col gap-4 h-full w-full mt-10 px-6">
                {menuButtons.map((e, index) => (
                    <button 
                        key={index} 
                        onClick={() => navigate(e.path)}
                        className={`h-11 w-full rounded-md hover:bg-light hover:text-primary-500 
                                    font-medium cursor-pointer transition-all ease-in-out
                                    ${location.pathname === e.path ? 
                                        'bg-light text-primary-500' : 
                                        'bg-primary text-white'}`
                                }>
                        {e.menu}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Sidemenu;
