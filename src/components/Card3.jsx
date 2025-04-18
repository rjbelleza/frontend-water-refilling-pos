import { useState, useEffect } from "react";
import { Trash } from "lucide-react"; 


const Card3 = ({ product, onQuantityChange, onRemove }) => {
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
                <p className="font-medium text-[14px]">{product.name}</p>
                <p className="text-[13px]">₱{product.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-3">
                <label for="quantity" className="font-medium text-[14px]">Quantity:</label>
                <input 
                    id="quantity"
                    type="number" 
                    className="h-[40px] w-[80px] px-2 border-1 border-gray-500 rounded-sm" 
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                />
                <button 
                    onClick={() => onRemove(product.id)}
                    className="cursor-pointer"
                >
                    <Trash size={20} />
                </button>
            </div>
        </div>
    );
}

export default Card3;
