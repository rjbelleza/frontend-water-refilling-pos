
const Login = () => {

    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <form className="flex flex-col gap-10 h-[470px] w-[400px] bg-secondary rounded-sm p-4">
                <p className="font-bold text-[25px] text-center">Login</p>
                <div className="flex flex-col w-full h-full gap-2 px-5">
                    <label className="ml-2">Email or Username</label>
                    <input type="text" className="h-[40px] w-full bg-light rounded-sm border-1 px-4" />

                    <label className="mt-6 ml-2">Password</label>
                    <input type="password" className="h-[40px] w-full bg-light rounded-sm border-1 px-4" />

                    <div className="flex flex-col justify-center items-center w-full h-[20px]">
                        <p></p>
                    </div>
                    <div className="flex items-center justify-between gap-2 h-[50px] w-full mb-2">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" className=" h-[15px] w-[15px]" />
                            <p>Remember me</p>
                        </div>
                        <p><u>Forgot Password?</u></p>
                    </div>
                    <button className="h-[50px] w-full bg-primary text-white rounded-md cursor-pointer
                            hover:bg-primary-500">LOGIN</button>
                </div>
            </form>
        </div>
    );
}

export default Login;
