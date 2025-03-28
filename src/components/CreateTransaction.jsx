import { useState, useMemo } from "react";
import Card2 from "./Card2";
import Card3 from "./Card3";

const CreateTransaction = () => {
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    const categories = ["Container", "Water"];

    const products = [
        {id: 1, name: "5-Gallon Bottle", category: "Water", price: 30.00, stock: 100},
        {id: 2, name: "3-Gallon Bottle", category: "Water", price: 25.00, stock: 100},
        {id: 3, name: "1-Gallon Bottle", category: "Water", price: 20.00, stock: 200},
        {id: 4, name: "5-Gallon Container", category: "Container", price: 15.00, stock: 150},
        {id: 5, name: "500ml Container", category: "Container", price: 15.00, stock: 150},
        {id: 6, name: "250ml Bottle", category: "Water", price: 15.00, stock: 150},
    ];

    
    // Add product handler
    const handleAddProduct = (product) => {
        if (product.stock <= 0) return;
        
        setSelectedProduct(prev => {
            const existing = prev.find(p => p.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) return prev;
                return prev.map(p => 
                    p.id === product.id 
                        ? {...p, quantity: (p.quantity || 1) + 1} 
                        : p
                );
            }
            return [...prev, {...product, quantity: 1}];
        });
    };


    const handleQuantityChange = (productId, newQuantity) => {
        setSelectedProduct(prev =>
            prev.map(product =>
                product.id === productId
                    ? { ...product, quantity: newQuantity }
                    : product
            )
        );
    };


    // Calculate total
    const totalAmount = useMemo(() => 
        selectedProduct.reduce((sum, product) => 
            sum + (product.price * (product.quantity || 1)), 
        0
    ), [selectedProduct]);


    // Filtered products
    const filteredProducts = useMemo(() => 
        products.filter(product => {
          const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
          return matchesSearch && matchesCategory;
        }),
        [products, searchTerm, selectedCategory]
    );


    const handleRemoveProduct = (productId) => {
        setSelectedProduct(prev => 
            prev.filter(product => product.id !== productId)
        );
    };


    return(
        <div className="flex h-[550px] w-full">

            <div className="h-full w-full overflow-auto">
                <div className="flex h-[80px] gap-4 bg-white sticky top-0">
                    <input 
                        type="text" 
                        placeholder="Search product name..." 
                        className="border-1 border-gray-500 px-5 py-1 rounded-sm h-[40px]" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <select 
                        className="border-1 border-gray-500 px-3 rounded-sm h-[40px]"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="All">All</option>
                        {categories ? categories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        )) : (
                            <option>All</option>
                        )}
                    </select>
                </div>

                <div className="grid grid-cols-3 gap-9 w-[95%] p-5 overflow-auto">
                    <Card2 products={filteredProducts} add={handleAddProduct} />
                </div>
            </div>

            <div className="h-full w-[650px] bg-blue-700 border-1 border-gray-400 rounded-md p-4">
                <p className="text-center bg-blue-600 text-gray-200 rounded-sm py-2 mb-1">Create Transaction</p>
                <div className="w-full h-[60%] bg-gray-200 border-1 border-gray-400 rounded-sm p-3 overflow-auto">
                    <div className="flex flex-col gap-3 w-full h-full">
                        {selectedProduct.length === 0 && 
                            <div className="flex justify-center items-center h-full w-full">
                                <p className="text-[17px] font-medium text-gray-500">Select a product to create new transaction</p>
                            </div>
                        }

                        {selectedProduct.map((product, index) => (
                            <Card3
                                key={index} 
                                product={product} 
                                onQuantityChange={handleQuantityChange}
                                onRemove={handleRemoveProduct}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex items-center h-[60px] w-full bg-blue-500 mt-2">
                    <p className="h-[70px] font-medium text-[20px] p-5"
                    style={{color: `${selectedProduct.length === 0 ? 'gray' : 'black'}`}}
                    >
                        Total Amount: ₱{totalAmount.toFixed(2)}
                    </p>
                </div>
                <div className="flex justify-center items-center h-[110px] bg-blue-500 w-full">
                <button 
                    className={`
                        bg-primary w-3/4 h-[50px] text-white text-[20px] font-medium 
                        rounded-md shadow-md shadow-black border-3 border-blue-900
                        transition-colors duration-200
                        ${selectedProduct.length === 0 
                        ? 'opacity-50 cursor-default' 
                        : 'cursor-pointer hover:bg-primary-100'}
                    `}
                    disabled={selectedProduct.length === 0}
                    >
                        Place Order
                </button>
                </div>
            </div>
        </div>
    );
}


const Modal = () => {

    return (
        <div>

        </div>
    );
}


export default CreateTransaction;
