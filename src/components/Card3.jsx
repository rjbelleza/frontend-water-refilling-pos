import { useState } from "react";

const Card3 = ({product, price}) => {
    const [quantity, setQuantity] = useState(1);


    return (
        <div className="flex items-center justify-between gap-20 w-full border-l-5 border-1 border-gray-400 
                      border-l-blue-600 bg-white rounded-sm p-3">
            <div>
                <p className="font-medium">{product.name}</p>
                <p>₱{product.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-3">
                <label>Qty.</label>
                <input 
                    type="number" 
                    className="h-[40px] w-[80px] px-2 border-1 border-gray-500 rounded-sm" 
                    min="1"
                    value={quantity}
                    onChange={(e) => {
                        const newQty = Math.max(1, parseInt(e.target.value) || 1);
                        setQuantity(newQty);
                        price((newQty - quantity) * product.price);
                      }}
                />
            </div>
        </div>
    );
}

export default Card3;
