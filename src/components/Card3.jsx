import { useState, useEffect } from "react";
import { X, Plus, Minus } from "lucide-react"; 


const Card3 = ({ product, onQuantityChange, onRemove, add, minus }) => {
    const [quantity, setQuantity] = useState(product.quantity || 1);

    const handleQuantityChange = (newQty) => {
        newQty = Math.max(1, parseInt(newQty) || 1); 
        setQuantity(newQty);
        onQuantityChange(product.id, newQty);
    };

    useEffect(() => {
        setQuantity(product.quantity || 1);
    }, [product.quantity]);

    return (
        <div className="flex items-center min-h-[30px] justify-between gap-15 w-full border-l-5 border-1 border-gray-400 
        border-l-blue-600 bg-white rounded-sm p-3">
            <div>
                <p className="font-medium text-[15px]">{product.name}</p>
                <p className="text-[14px]">₱{product.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-3">  
                <button type="button" onClick={() => add(product)}>
                    <Plus size={28} className="p-1 bg-blue-800 text-white rounded-full cursor-pointer" />
                </button> 
                <input 
                    id="quantity"
                    type="text" 
                    className="h-[40px] w-[80px] px-2 border-1 border-gray-500 rounded-sm" 
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                />
                <button type="button" onClick={() => minus(product)}>
                    <Minus size={28} className="p-1 bg-blue-800 text-white rounded-full cursor-pointer" />
                </button>
                <button 
                    type="button"
                    onClick={() => onRemove(product.id)}
                    className="cursor-pointer ml-5 p-1 rounded-full bg-gray-300"
                >
                    <X size={15} className="text-gray-700" />
                </button>
            </div>
        </div>
    );
}

export default Card3;
