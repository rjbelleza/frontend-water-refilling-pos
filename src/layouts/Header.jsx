import { Link } from "react-router-dom";

const Header = () => {

    return (
        <div className="flex items-center justify-between h-15 w-full bg-primary fixed top-0 z-100">
            <Link to="/admin-dashboard">
                <img src="/images/Aqua2.png" alt="logo" className="h-10 ml-15 cursor-pointer" />
            </Link>
            <p className="text-white mr-15 cursor-pointer">Logout</p>
        </div>
    );
}

export default Header;
