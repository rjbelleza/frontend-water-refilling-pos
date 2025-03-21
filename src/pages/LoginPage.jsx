import { Link } from "react-router-dom";

const LoginPage = () => {

    return (
        <div 
            className="h-screen w-screen flex flex-col justify-center items-center bg-[url('/images/login-background.png')]
                    bg-cover bg-center"
        >
        <div className="flex flex-col items-center justify-center text-[20px] mb-10">
            <h1 className="font-bold">Aqua Springs</h1>
            <h1 className="text-[15px]">POS System</h1>
        </div>
            <form 
                className="flex flex-col gap-10 h-[470px] w-[400px] bg-white rounded-sm p-4
                    shadow-[1px_1px_5px_black]"
            >
                <div className="flex justify-between items-center">
                    <p className="font-bold text-[30px] text-left pl-4 text-primary">Login</p>
                    <img src="/images/Aqua2.png" alt="Logo" className="h-12 mr-5" />
                </div>

                <div className="flex flex-col w-full h-full gap-2 px-5">
                    <label className="ml-2 font-medium">Email or Username</label>
                    <input 
                        type="text" 
                        className="h-[40px] font-medium w-full bg-white rounded-xl 
                                border-3 hover:border-4 border-primary px-4" 
                    />

                    <label className="mt-6 ml-2 font-medium">Password</label>
                    <div className="relative">
                        <input 
                            className="h-[40px] font-medium w-full bg-white rounded-xl 
                                   border-3 hover:border-4 border-primary px-4 pr-10" 
                        />
                    </div>

                    <div className="flex flex-col justify-center items-center w-full h-[20px]">
                        <p className="text-red-600 text-[13px] mt-3"></p>
                    </div>

                    <div className="flex items-center justify-between gap-2 h-[50px] w-full mb-2">
                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                className="h-[15px] w-[15px]" 
                            />
                            <p>Remember me</p>
                        </div>
                        <Link to="/">
                            <p className="cursor-pointer hover:font-medium"><u>Forgot Password?</u></p>
                        </Link>
                    </div>
                    <button 
                        type="submit"
                        className="h-[50px] w-full bg-primary text-white font-bold rounded-md cursor-pointer
                            hover:bg-primary-500 disabled:bg-gray-400"
                    >LOGIN
                    </button>
                </div>
            </form>
        </div>
        
    );
}

export default LoginPage;
