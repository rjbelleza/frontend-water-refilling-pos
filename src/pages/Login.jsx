import { useState } from "react";
import { useNavigate, Link } from "react-router"; // Fixed import
import { useUser } from "../components/UserContext";

const Login = () => {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Add a loading state
    const [showPassword, setShowPassword] = useState(false); // Add show/hide password state
    const navigate = useNavigate();
    const { login } = useUser();  

    const handleLogin = async (e) => {
        e.preventDefault(); 
        setError(""); // Clear previous errors
        setLoading(true); // Set loading to true

        try {
            // Fetch the users from data.json
            const response = await fetch('/data/data.json'); 
            const data = await response.json();

            // Find the user with matching credentials
            const user = data.users.find(
                (u) => (u.username === username || u.email === username) && u.password === password
            );

            if (user) {
                login(user); // Save user credentials and role in context

                // Redirect based on the user's role
                if (user.role === "admin") {
                    navigate("/admin-dashboard"); 
                } else if (user.role === "staff") {
                    navigate("/staff-inventory"); 
                } else {
                    setError('Unauthorized role'); 
                }
            } else {
                setError('Invalid credentials'); 
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('An error occurred. Please try again.'); 
        } finally {
            setLoading(false); // Set loading to false
        }
    };

    return (
        <div 
            className="h-screen w-screen flex justify-center items-center bg-[url('/images/login-background.png')]
                    bg-cover bg-center"
        >
            <form
                onSubmit={handleLogin} 
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
                        onChange={(e) => setUserName(e.target.value)}
                        value={username}
                        type="text" 
                        className="h-[40px] font-medium w-full bg-white rounded-xl 
                                border-3 hover:border-4 border-primary px-4" 
                    />

                    <label className="mt-6 ml-2 font-medium">Password</label>
                    <div className="relative">
                        <input 
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type={showPassword ? "text" : "password"} // Toggle input type
                            className="h-[40px] font-medium w-full bg-white rounded-xl 
                                   border-3 hover:border-4 border-primary px-4 pr-10" 
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)} // Toggle show/hide
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                        >
                            {/* Use local icons for show/hide password */}
                            {showPassword ? (
                                <img 
                                    src="src/assets/icons/hide.png" // Path to your "hide" icon
                                    alt="Hide Password"
                                    className="h-5 w-5"
                                />
                            ) : (
                                <img 
                                    src="src/assets/icons/show.png" // Path to your "show" icon
                                    alt="Show Password"
                                    className="h-5 w-5"
                                />
                            )}
                        </button>
                    </div>

                    <div className="flex flex-col justify-center items-center w-full h-[20px]">
                        <p className="text-red-600 text-[13px] mt-3">{error}</p>
                    </div>

                    <div className="flex items-center justify-between gap-2 h-[50px] w-full mb-2">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" className=" h-[15px] w-[15px]" />
                            <p>Remember me</p>
                        </div>
                        <Link to="/forgot-password">
                            <p className="cursor-pointer hover:font-medium"><u>Forgot Password?</u></p>
                        </Link>
                    </div>
                    <button 
                        type="submit"
                        disabled={loading} // Disable button while loading
                        className="h-[50px] w-full bg-primary text-white font-bold rounded-md cursor-pointer
                            hover:bg-primary-500 disabled:bg-gray-400"
                    >
                        {loading ? "Logging in..." : "LOGIN"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Login;
