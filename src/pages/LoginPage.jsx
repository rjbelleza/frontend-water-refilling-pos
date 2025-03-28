import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { OctagonAlert } from "lucide-react";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setValidationErrors([]);
        setIsSubmitting(true);

        try {
            const result = await login(email, password);

            if (result.success) {
                // Fetch user role from AuthContext or API
                const userRole = result.user?.role; 

                if (userRole === "admin") {
                    navigate("/admin-dashboard");
                } else {
                    navigate("/new-sales"); // Redirect non-admins
                }
            } else {
                if (result.errors) {
                    setValidationErrors(Object.values(result.errors).flat());
                } else {
                    setError(result.message || "Invalid credentials");
                }
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center bg-[url('/images/login-background.png')] bg-cover bg-center">
            <div className="flex flex-col items-center justify-center text-[20px] mb-10">
                <h1 className="font-bold">Aqua Springs</h1>
                <h1 className="text-[15px]">POS System</h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-10 h-[470px] w-[400px] bg-white rounded-sm p-4 shadow-[1px_1px_5px_black]">
                <div className="flex justify-between items-center">
                    <p className="font-bold text-[30px] text-left pl-4 text-primary">Login</p>
                    <img src="/images/Aqua2.png" alt="Logo" className="h-12 mr-5" />
                </div>

                <div className="flex flex-col w-full h-full gap-2 px-5">
                    <label className="ml-2 font-medium">Email or Username</label>
                    <input
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError(""); 
                            setValidationErrors([]);
                        }}
                        type="text"
                        className="h-[40px] font-medium w-full bg-white rounded-xl border-3 hover:border-4 border-primary px-4"
                        disabled={isSubmitting}
                    />

                    <label className="mt-6 ml-2 font-medium">Password</label>
                    <div className="relative">
                        <input
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                                setValidationErrors([]);
                            }}
                            type="password"
                            className="h-[40px] font-medium w-full bg-white rounded-xl border-3 hover:border-4 border-primary px-4 pr-10"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex items-center justify-between gap-2 h-[50px] w-full mb-2">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" className="h-[15px] w-[15px]" disabled={isSubmitting} />
                            <p>Remember me</p>
                        </div>
                        <Link to="/forgot-password" className="hover:font-medium">
                            <u>Forgot Password?</u>
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`h-[50px] w-full text-white font-bold rounded-md cursor-pointer ${
                            isSubmitting ? "bg-gray-400" : "bg-primary hover:bg-primary-500"
                        }`}
                    >
                        {isSubmitting ? "Logging in..." : "LOGIN"}
                    </button>
                </div>
            </form>

            {validationErrors.length > 0 && <ToastMessage error={validationErrors} />}
        </div>
    );
};

const ToastMessage = ({ error }) => {
    return (
        <div className="flex items-center justify-center gap-3 text-red-900 font-medium w-fit h-fit bg-red-400 rounded-md z-100 mt-[-10px] py-3 px-10">
            <OctagonAlert />
            {error.map((e, i) => (
                <p key={i}>{e}</p>
            ))}
        </div>
    );
};

export default LoginPage;
