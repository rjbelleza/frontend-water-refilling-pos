
const ForgotPasswordPage = () => {

    return (
        <div className="flex justify-center items-center h-screen bg-[url('/images/login-background.png')]
            bg-cover bg-center">
            <form className="flex flex-col gap-10 h-[360px] w-[400px] bg-white rounded-sm p-5
                    shadow-[1px_1px_5px_black]">
                <div className="flex justify-between items-center">
                    <p className="font-bold text-[20px] text-left pl-4 text-primary">
                        Forgot Password
                    </p>
                    <img src="/images/Aqua2.png" alt="Logo" className="h-9 mr-5" />
                </div>
                <div className="flex flex-col justify-center items-center h-full w-full px-6">
                    <p className="text-[12px] text-gray-500 font-medium mb-[20px]">
                        By submitting this form, you confirm that you have the 
                        right to access the account associated with the provided email address.
                    </p>
                    <input 
                        type="email" 
                        placeholder="Enter Valid Email"
                        className="h-[50px] font-medium w-full bg-white rounded-xl 
                                    border-3 hover:border-4 border-primary px-4 mb-[30px]" 
                    />
                    <button type="submit" className="h-[50px] w-full bg-primary text-white font-bold 
                            rounded-md cursor-pointer hover:bg-primary-500 shadow-[3px_3px_4px_black]">
                        SEND RESET LINK
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ForgotPasswordPage;
