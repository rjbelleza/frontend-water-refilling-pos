import { useState, useEffect } from "react";
import api from "../api/axios";
import { AlertCircle, X } from "lucide-react"; 


const AlertPopUp = ({refresh}) => {
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);


    // Close button handler
    const handleClose = () => {
        setShowAlert(false);
        setMessage('');
    };


    // Fetch low Stock Products on mount
    useEffect(() => {
        const fetchLowStocks = async () => {
            try {
                const res = await api.get('/alert/low_stock_products');
                setData(res.data?.data);

                if (res.data?.data?.length > 0) {
                    setShowAlert(true);
                } else {
                    setShowAlert(false);
                }
            } catch (err) {
                setMessage('Error fetching low stock products.');
                setShowAlert(true);
            }
        }

        fetchLowStocks();
    }, [refresh]);


    return (
        <>
            {showAlert && (
                <div className="flex justify-between min-w-[270px] min-h-[50px] fixed bg-white border-2 border-yellow-500 z-1000 bottom-5 right-5 mx-auto rounded p-2">
                    <div className="flex gap-5">
                        <AlertCircle size={25} className="text-yellow-500" />
                            <div className="pb-1">
                                {message 
                                    ? <p className="text-black font-medium text-[14px]">{message}</p> 
                                : <>
                                    <p className="text-[15px] mb-2">Running out of stock:</p>
                                    {data.map((p) => (
                                            <li key={p.id} className="text-primary font-medium text-[14px]">{p.name}</li>
                                    ))}
                                  </> 
                                }
                            </div>
                    </div>
                    <span className="ml-5">
                        <button 
                            type="button"
                            onClick={handleClose}
                        >
                            <X size={15} className="cursor-pointer hover:text-gray-700" />
                        </button>
                    </span>
                </div>
            )}
        </>
    );
}

export default AlertPopUp;
