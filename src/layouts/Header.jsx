
const Header = () => {

    return (
        <div className="flex items-center justify-between h-[60px] w-full fixed top-0 bg-primary px-20 z-100">
            <div className="flex text-[#74edeb] text-[20px] cursor-pointer">
                Aqua<p className="font-bold text-white">SPRING</p>
            </div>
            <p className="text-white cursor-pointer">
                Logout
            </p>
        </div>
    );
}

export default Header;
