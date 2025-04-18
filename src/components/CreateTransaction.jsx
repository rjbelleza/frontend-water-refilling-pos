import { useState, useMemo, useEffect } from "react";
import Card2 from "./Card2";
import Card3 from "./Card3";
import { Search, Funnel, Store } from "lucide-react";

const CreateTransaction = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [discount, setDiscount] = useState(null);
    
    const categories = ["Container", "Water"];


    useEffect(() => {
        fetch('/data/products.json')
        .then(response => response.json())
        .then(jsonData => setProducts(jsonData))
        .catch(error => console.error('Error fetching data:', error))
    }, [])

    
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
        <div className="grid grid-cols-5 h-full w-full">

            {/* Products Section */}
            <div className="col-span-3 flex flex-col items-center h-full mr-5 scrollbar-thin overflow-y-auto px-5">

                <div className="flex justify-between items-center w-full bg-white border border-gray-300 px-3 py-3 sticky top-0 mb-10 rounded-lg">

                    <p className="font-bold text-[15px] text-sky-900/90">AVAILABLE PRODUCTS</p>

                    <div className="flex gap-5">
                        <div className="relative">
                            <Search size={20} className="text-gray-500 absolute left-1 top-1" />
                            <input 
                                type="text" 
                                placeholder="Search product" 
                                className="top-0 text-[13px] border-1 border-gray-500 py-1 pl-7 pr-5 rounded-sm w-[170px]" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                    </div>
                    <div className="relative">
                        <Funnel size={20} className="text-gray-500 absolute left-1 top-1" />
                        <select 
                            className="text-[13px] border-1 border-gray-500 pl-7 h-full rounded-sm"
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
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-5 w-full scrollbar-thin overflow-y-auto">
                    <Card2 products={filteredProducts} add={handleAddProduct} />
                </div>
            </div>


            {/* New Transaction Section */}
            <div className="col-span-2 h-fit w-full bg-white border-3 border-gray-400 rounded-md p-4 ml-2">
                <p className="font-medium text-center bg-sky-900 text-gray-200 rounded-sm py-2 mb-1">Order List</p>
                <div className="w-full min-h-[20%] bg-gray-200 border-1 border-gray-400 rounded-sm p-3 overflow-auto">
                    <div className="flex flex-col justify-center items-center gap-3 w-full h-full">
                        {selectedProduct.length === 0 && 
                            <div className="flex justify-center items-center h-full w-full">
                                <p className="text-[17px] font-medium text-gray-500 my-5">Select a product to create new transaction</p>
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

                <div className="flex flex-col gap-10 justify-between p-5 mt-10">
                    <div className="flex flex-col gap-2">
                        <label 
                            htmlFor="cust-name"
                            className={`text-[14px] font-medium ${selectedProduct.length == 0 ? 'text-gray-500' : 'text-blue-800'}`}
                        >Customer Name <span className="text-red-500">*</span></label>
                        <div  className="relative">
                            <button className="cursor-pointer">
                                <Store size={20} className={`absolute right-2 top-2 ${selectedProduct.length == 0 ? 'text-gray-500' : 'text-white'}`} />
                            </button>
                            <input 
                                type="text" 
                                id="cust-name"
                                required
                                disabled={selectedProduct.length === 0}
                                className={`min-h-[35px] w-full border-1 border-gray-400 rounded-sm px-5 border-r-35 ${selectedProduct.length == 0 ? 'border-r-gray-500' : 'border-r-blue-800'}`}
                                style={{color: `${selectedProduct.length === 0 ? 'gray' : 'black'}`}}
                            />
                        </div>
                    
                    </div>
                    <div className="flex flex-col gap-2">
                        <label 
                            htmlFor="discount"
                            className={`text-[14px] font-medium ${selectedProduct.length == 0 ? 'text-gray-500' : 'text-blue-800'}`}
                            >Discount</label>
                        <select
                            id="discount"
                            style={{color: `${selectedProduct.length === 0 ? 'gray' : 'black'}`}} 
                            className="min-h-[35px] w-full text-[13px] border-1 border-gray-400 rounded-sm px-5" 
                            onChange={(e) => setDiscount(e.target.value)}
                            disabled={selectedProduct.length === 0}
                        >
                            <option>-- Select Discount --</option>
                            <option value={10}>10%</option>
                            <option value={20}>20%</option>
                            <option value={50}>50%</option>
                            <option value={70}>70%</option>
                            <option value={90}>90%</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-3 h-[60px] w-full bg-white mt-2 p-5">
                    <div className="flex justify-between w-full">
                        <p className={`text-[14px] font-medium ${selectedProduct.length == 0 ? 'text-gray-500' : 'text-blue-800'}`}>
                            Subtotal
                        </p>
                        <p className={`text-[14px] font-medium ${selectedProduct.length == 0 ? 'text-gray-500' : 'text-blue-950'}`}>
                            ₱{totalAmount.toFixed(2)}
                        </p>
                    </div>
                    <div className="flex justify-between w-full">
                        <p className={`text-[16px] font-medium ${selectedProduct.length == 0 ? 'text-gray-500' : 'text-blue-800'}`}>
                            Total Amount
                        </p>
                        <p className={`text-[16px] font-medium ${selectedProduct.length == 0 ? 'text-gray-500' : 'text-blue-950'}`}>
                            ₱{totalAmount.toFixed(2)}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end items-end h-[110px] bg-white w-full mt-6 px-15 pb-5">
                <button 
                    disabled={selectedProduct.length === 0}
                    className={`
                        bg-blue-700 w-full h-[50px] text-white text-[20px] font-medium rounded-md shadow-md shadow-black transition-colors duration-200
                        ${selectedProduct.length === 0 
                        ? 'opacity-50 cursor-default' 
                        : 'cursor-pointer hover:bg-blue-600'}`}
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
