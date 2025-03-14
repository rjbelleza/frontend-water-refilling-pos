
const Header = () => {

    return (
        <div className="flex items-center justify-between h-[60px] w-full sticky top-0 bg-primary px-20">
            <p className="flex text-sun text-[20px] cursor-pointer">
                Aqua<p className="font-bold text-white">SPRING</p>
            </p>
            <p className="text-white cursor-pointer">
                Logout
            </p>
        </div>
    );
}

export default Header;
