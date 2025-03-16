import { useState } from "react";
import { useNavigate } from "react-router";
import { dummyUser } from "../components/Dummy";

const Login = () => {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

   const handleLogin = (e) => {
    e.preventDefault();

    if(!user || !password) {
        setError("Fields cannot be empty!")
    }

    dummyUser.forEach((e) => {
        if((user !== e.email || user !== e.username) && password !== e.password) {
            setError("Invalid Credentials!");
            setUser("");
            setPassword("");
        }
        else {
            if(e.role === "admin") {
                navigate("/admin-dashboard");
            }
            else if(e.role === "staff") {
                navigate("/staff-dashboard");
            }
            else {
                setError("Invalid Role!");
                setUser("");
                setPassword("");
            }
        }
    })
   }

    return (
        <div className="h-screen w-screen flex justify-center items-center bg-gray-200">
            <form
                onSubmit={handleLogin} 
                className="flex flex-col gap-10 h-[470px] w-[400px] bg-white rounded-sm p-4
                    shadow-[1px_1px_5px_black]">
                <p className="font-bold text-[30px] text-left pl-4 text-primary">Login</p>

                <div className="flex flex-col w-full h-full gap-2 px-5">
                    <label className="ml-2 font-medium">Email or Username</label>
                    <input 
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                        type="text" 
                        className="h-[40px] font-medium w-full bg-white rounded-xl 
                                border-3 hover:border-4 border-primary px-4" />

                    <label className="mt-6 ml-2 font-medium">Password</label>
                    <input 
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type="password" 
                        className="h-[40px] font-medium w-full bg-white rounded-xl 
                                   border-3 hover:border-4 border-primary px-4" />

                    <div className="flex flex-col justify-center items-center w-full h-[20px]">
                        <p className="text-red-600 text-[13px] mt-3">{error}</p>
                    </div>

                    <div className="flex items-center justify-between gap-2 h-[50px] w-full mb-2">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" className=" h-[15px] w-[15px]" />
                            <p>Remember me</p>
                        </div>
                        <p className="cursor-pointer hover:font-medium"><u>Forgot Password?</u></p>
                    </div>
                    <button 
                        type="submit"
                        className="h-[50px] w-full bg-primary text-white font-bold rounded-md cursor-pointer
                            hover:bg-primary-500">LOGIN</button>
                </div>
            </form>
        </div>
    );
}

export default Login;
