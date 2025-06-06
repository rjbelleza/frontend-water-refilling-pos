import { X } from "lucide-react";

const StockSettings = ({handleInputChange, setShow, lowStock, handleSubmit, currentThrshld}) => {

    return (
        <div
          className="fixed h-screen inset-0 flex items-center justify-center z-1000 overflow-y-auto scrollbar-thin"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
            <div className="min-w-[350px] max-w-[800px] bg-white pb-5 rounded-sm shadow-lg">
                <p className="flex justify-between w-full text-[19px] border-b-1 border-dashed border-gray-400 font-medium text-primary mb-8 p-5">
                Set Low Stock Alert
                <span className="text-gray-800 hover:text-gray-600 font-normal">
                    <button
                        type="button"
                        onClick={() => setShow(false)}
                        className="cursor-pointer"
                    >
                    <X size={20} />
                    </button>
                </span>
                </p>
                <form onSubmit={handleSubmit} className="w-full px-5">
                    <p className="mb-5">Current Threshold: <span className="font-medium">{currentThrshld}</span></p>
                    <p className="text-[13px] mb-5 text-gray-600">The alert will be applied to all <span className="text-primary font-medium">item</span> type products.</p>
                    <input 
                        type="text"
                        name="low_stock_threshold"
                        value={lowStock.low_stock_threshold}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-primary rounded mb-7"
                        placeholder="Enter stock level"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-2 rounded font-medium hover:bg-primary-100 cursor-pointer"
                    >
                        CONFIRM
                    </button>
                </form>
            </div>
        </div>
    );
}

export default StockSettings;
