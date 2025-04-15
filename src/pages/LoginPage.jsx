import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { OctagonAlert, Eye, EyeOff, Loader2 } from "lucide-react";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setValidationErrors([]);
        setIsSubmitting(true);
    
        try {
            const user = await login(formData.username, formData.password);
            
            // Redirect based on user role after successful login
            if (user?.role === "admin") {
                navigate('/admin-dashboard');
            } else if (user?.role === "staff") {
                navigate('/new-sales');
            } else {
                navigate('/'); // Default redirect if role is unknown
            }
        } catch (err) {
            console.error('Login error:', err);
            if (err.response?.data?.errors) {
                setValidationErrors(Object.values(err.response.data.errors).flat());
            } else {
                setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear errors when user starts typing
        if (error || validationErrors.length) {
            setError('');
            setValidationErrors([]);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-[url('/images/login-background.png')] bg-cover bg-center bg-no-repeat p-4">
            <div className="flex flex-col items-center justify-center text-center mb-8">
                <h1 className="text-2xl font-bold">Aqua Springs</h1>
                <h2 className="text-lg">POS System</h2>
            </div>

            <form 
                onSubmit={handleSubmit} 
                className="w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-400 overflow-hidden"
            >
                <div className="flex justify-between items-center p-6 bg-gray-50 border-b border-gray-400 mb-7">
                    <h2 className="text-2xl font-bold text-primary">Login</h2>
                    <img 
                        src="/images/Aqua2.png" 
                        alt="Logo" 
                        className="h-12 object-contain" 
                    />
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="username" className="block font-medium">
                            Username*
                        </label>
                        <input
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            type="text"
                            className="w-full px-4 py-2 border border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                            disabled={isSubmitting}
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="block font-medium">
                            Password*
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-2 border border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition pr-10"
                                disabled={isSubmitting}
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-500" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-500" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                                className="h-4 w-4 text-primary rounded focus:ring-primary"
                                disabled={isSubmitting}
                            />
                            <label htmlFor="remember-me" className="ml-2 text-sm">
                                Remember me
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-colors hover:bg-blue-800 cursor-pointer ${
                            isSubmitting 
                                ? "bg-gray-400 cursor-not-allowed" 
                                : "bg-primary hover:bg-primary-600"
                        } flex items-center justify-center`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                Logging in...
                            </>
                        ) : (
                            "LOGIN"
                        )}
                    </button>
                </div>
            </form>

            {(error || validationErrors.length > 0) && (
                <ToastMessage 
                    error={error ? [error] : validationErrors} 
                    onDismiss={() => {
                        setError('');
                        setValidationErrors([]);
                    }}
                />
            )}
        </div>
    );
};

const ToastMessage = ({ error, onDismiss }) => {
    return (
        <div className="mt-4 animate-fade-in-up">
            <div className="flex items-start max-w-md p-4 bg-red-50 rounded-lg shadow-lg border border-red-200">
                <OctagonAlert className="flex-shrink-0 h-5 w-5 text-red-600 mt-0.5" />
                <div className="ml-3">
                    <div className="text-sm font-medium text-red-800">
                        {error.map((e, i) => (
                            <p key={i}>{e}</p>
                        ))}
                    </div>
                </div>
                <button
                    onClick={onDismiss}
                    className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-100 inline-flex h-8 w-8"
                    aria-label="Close"
                >
                    <span className="sr-only">Close</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
