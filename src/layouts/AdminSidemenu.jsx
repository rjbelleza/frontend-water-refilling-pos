
const AdminSidemenu = () => {
    const user = {name: 'Jack Frost', email: 'jack@gmail.com', role: 'admin'};

    return (
        <div className="flex h-full w-60 bg-[url('/images/sidemenu.png')] bg-cover bg-center mt-2 rounded-tr-md
                        shadow-[2px_0px_10px_gray] bg-opacity-30 fixed left-0 justify-center p-5"
        >
            <div className="flex flex-col gap-1 h-fit w-50 rounded-lg">
                <div className="flex flex-col items-center w-full">
                    <p>Welcome,</p>
                    <p className="font-bold text-[20px]">{user.name}</p>
                    <p className="w-full text-center text-black font-light text-[20px] mt-3 bg-gray-300 rounded-xl p-1">
                        {user.role.toLocaleUpperCase()}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AdminSidemenu;
