import { useState, useMemo, useEffect } from "react";
import Snackbar from "./Snackbar";
import { Search, Funnel, Store, X, Plus, Minus, Printer } from "lucide-react";
import api from "../api/axios";
import LoadingAnimation from "./LoadingAnimation";

const CreateTransaction = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [discountType, setDiscountType] = useState('percentage'); 
    const [placeOrder, setPlaceOrder] = useState(false);
    const [custName, setCustName] = useState('Walk-in');
    const [message, setMessage] = useState('');
    const [responseStatus, setResponseStatus] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [loading, setLoading] = useState(true);
    const [amountPaid, setAmountPaid] = useState(''); 
    const [discount, setDiscount] = useState(''); 

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0].replaceAll('-', '/');
    const now = new Date();
    const time = now.toLocaleTimeString();

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data.data || response.data);
            setLoading(false);
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to fetch products");
            setResponseStatus("error");
            setShowSnackbar(true);
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            const cats = response.data?.data || response.data || [];
            setCategories(['All', ...cats]);
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to fetch categories");
            setResponseStatus("error");
            setShowSnackbar(true);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleAddProduct = (product) => {
        if (product.track_stock === 1 && product.stock_quantity <= 0) return;
        
        setSelectedProduct(prev => {
            const existing = prev.find(p => p.id === product.id);
            if (existing) {
                if (product.track_stock === 1 && existing.quantity >= product.stock_quantity) return prev;
                return prev.map(p => 
                    p.id === product.id 
                        ? {...p, quantity: (p.quantity || 1) + 1} 
                        : p
                );
            }
            return [...prev, {...product, quantity: 1}];
        });
    };

    const handleMinusProduct = (product) => {
        setSelectedProduct(prev => {
            const existingIndex = prev.findIndex(p => p.id === product.id);
            if (existingIndex !== -1) {
                const existing = prev[existingIndex];
                if (existing.quantity <= 1) {
                    return prev.filter(p => p.id !== product.id);
                }
                return prev.map(p => 
                    p.id === product.id 
                        ? {...p, quantity: p.quantity - 1} 
                        : p
                );
            }
            return prev;
        });
    };

    const handleQuantityChange = (productId, newQuantity) => {
        const product = products.find(p => p.id === productId);
        const numQuantity = Math.max(1, parseInt(newQuantity) || 1);
        const maxQuantity = product.track_stock === 0 ? numQuantity : product.stock_quantity;
        setSelectedProduct(prev =>
            prev.map(product =>
                product.id === productId 
                    ? { ...product, quantity: Math.min(numQuantity, maxQuantity) }
                    : product
            )
        );
    };

    const numericDiscount = discount === '' ? 0 : parseFloat(discount);
    const numericAmountPaid = amountPaid === '' ? 0 : parseFloat(amountPaid);

    const subtotal = useMemo(() => 
        selectedProduct.reduce((sum, product) => 
            sum + (parseFloat(product.price) * (product.quantity || 1)), 
        0
    ), [selectedProduct]);

    const discountedAmount = useMemo(() => {
        if (discountType === 'percentage') {
            return subtotal - (subtotal * (numericDiscount / 100));
        } else {
            return subtotal - numericDiscount;
        }
    }, [subtotal, numericDiscount, discountType]);

    const change = useMemo(() => {
        return numericAmountPaid - discountedAmount;
    }, [numericAmountPaid, discountedAmount]);

    const filteredProducts = useMemo(() => 
        products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const productCategory = typeof product.category === 'object' ? product.category.name : product.category;
            const matchesCategory = selectedCategory === 'All' || productCategory === selectedCategory;
            return matchesSearch && matchesCategory;
        }),
        [products, searchTerm, selectedCategory]
    );

    const handleRemoveProduct = (productId) => {
        setSelectedProduct(prev => 
            prev.filter(product => product.id !== productId)
        );
    };

    const handleAmountPaid = (e) => {
        const value = e.target.value;
        if (value === '' || !isNaN(value)) {
            setAmountPaid(value);
        }
    };
      
    const handleDiscountChange = (e) => {
        const value = e.target.value;
        if ((value.match(/\./g) || []).length > 1) return;
        if (value === '' || !isNaN(value)) {
            setDiscount(value);
        }
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        
        if (!custName || amountPaid < discountedAmount) return;
        
        try {
            const transactionData = {
                customer_name: custName,
                products: selectedProduct.map(product => ({
                    product_id: product.id,
                    quantity: product.quantity,
                    price: product.price
                })),
                subtotal: subtotal,
                discount: discount,
                discount_type: discountType,
                amount_paid: amountPaid
            };

            const response = await api.post('/sales', transactionData);

            setPlaceOrder(true);
            setMessage(response.data?.message);
            setResponseStatus(response.data?.status);
            setShowSnackbar(true);
            fetchProducts();
            
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to create transaction");
            setResponseStatus(error.response?.data?.status);
            setShowSnackbar(true);
        }
    };

    const resetSale = () => {
        setPlaceOrder(false);
        setCustName('');
        setSelectedProduct([]);
        setDiscount('');
        setAmountPaid('');
    };

    return(
        <div className="grid grid-cols-6 gap-10 w-full pb-3">
            {showSnackbar && (
                <Snackbar 
                    message={message}
                    type={responseStatus}
                    onClose={() => setShowSnackbar(false)}
                />
            )}

            <div className="col-span-3 flex flex-col items-center h-full">
                <div className="flex justify-between items-center w-full bg-white border border-gray-300 px-3 py-3 sticky top-20 mb-10 rounded-lg">
                    <p className="font-bold text-[15px] text-primary">AVAILABLE PRODUCTS</p>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search size={20} className="text-gray-500 absolute left-1 top-1" />
                            <input 
                                type="text" 
                                placeholder="Search" 
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
                                {categories.map((category, index) => (
                                    <option key={index} value={typeof category === 'object' ? category.name : category}>
                                        {typeof category === 'object' ? category.name : category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <LoadingAnimation />
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-8 w-full scrollbar-thin overflow-y-auto sticky top-45">
                        <Card2 
                            products={filteredProducts} 
                            add={handleAddProduct} 
                            selectedProducts={selectedProduct}
                        />
                    </div>
                )}
            </div>

            <form 
                onSubmit={handlePlaceOrder}
                className="col-span-3 w-full h-fit bg-white rounded-md p-4"
            >
                <p className="font-medium text-center bg-primary text-gray-200 rounded-sm py-2 mb-1">Current Order</p>
                <div className="w-full min-h-[20%] bg-gray-200 border-1 border-gray-100 rounded-sm p-3 overflow-auto">
                    <div className="flex flex-col justify-center items-center gap-3 w-full h-full">
                        {selectedProduct.length === 0 && 
                            <div className="flex justify-center items-center h-full w-full">
                                <p className="text-[17px] font-medium text-gray-500 my-5">Select a product to create new sale</p>
                            </div>
                        }

                        {selectedProduct.map((product, index) => (
                            <Card3
                                key={index} 
                                product={product} 
                                onQuantityChange={handleQuantityChange}
                                onRemove={handleRemoveProduct}
                                add={() => handleAddProduct(product)}
                                minus={() => handleMinusProduct(product)}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-10 justify-between p-5 mt-10">
                    <div className="flex flex-col gap-2">
                        <label 
                            htmlFor="cust-name"
                            className={`text-[14px] font-medium ${selectedProduct.length == 0 ? 'text-gray-500' : 'text-primary'}`}
                        >
                            Customer Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <button 
                                type="button"
                                onClick={() => setCustName('Walk-in')}
                                className="cursor-pointer"
                            >
                                <Store size={20} className={`absolute right-2 top-2 ${selectedProduct.length == 0 ? 'text-gray-500' : 'text-white'}`} />
                            </button>
                            <input 
                                type="text" 
                                id="cust-name"
                                required
                                disabled={selectedProduct.length === 0}
                                onChange={(e) => setCustName(e.target.value)}
                                value={selectedProduct.length === 0 ? '' : custName}
                                className={`min-h-[40px] text-[15px] w-full border-1 border-gray-400 rounded-sm px-5 border-r-37 ${selectedProduct.length == 0 ? 'border-r-gray-500' : 'border-r-primary'}`}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label 
                            htmlFor="discount"
                            className={`text-[14px] font-medium ${selectedProduct.length == 0 ? 'text-gray-500' : 'text-primary'}`}
                        >
                            Discount
                        </label>
                        <div className="flex gap-3">
                            <button 
                                type="button"
                                disabled={selectedProduct.length === 0}
                                className={`${discountType === 'percentage' ? 'bg-primary' : 'bg-gray-400'} text-white text-[13px] font-medium px-3 py-1 rounded-sm cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed`}
                                onClick={() => setDiscountType('percentage')}
                            >
                                Percent
                            </button>
                            <button
                                type="button" 
                                disabled={selectedProduct.length === 0}
                                className={`${discountType === 'fixed' ? 'bg-primary' : 'bg-gray-400'} text-white text-[13px] font-medium px-3 py-1 rounded-sm cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed`}
                                onClick={() => setDiscountType('fixed')}
                            >
                                Fixed
                            </button>
                        </div>
                        <input 
                            type="text"
                            min={0}
                            max={discountType === 'percentage' ? 100 : subtotal}
                            disabled={selectedProduct.length === 0}
                            value={discount}
                            onChange={handleDiscountChange}
                            className="border border-gray-400 text-[15px] min-h-[40px] rounded-sm px-5 py-1"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3 h-[60px] w-full mt-2 p-5 mb-25">
                    <div className="flex justify-between w-full">
                        <p className={`text-[18px] font-medium ${selectedProduct.length == 0 ? 'text-gray-500' : 'text-primary'}`}>
                            Subtotal
                        </p>
                        <p className={`text-[18px] font-medium ${selectedProduct.length == 0 ? 'text-gray-500' : 'text-primary'}`}>
                            ₱{subtotal.toFixed(2)}
                        </p>
                    </div>
                    <div className="flex justify-between w-full">
                        <p className={`text-[18px] font-medium ${selectedProduct.length == 0 ? 'text-gray-500' : 'text-primary'}`}>
                            Discount Applied
                        </p>
                        <p className={`text-[18px] font-medium ${selectedProduct.length == 0 ? 'text-gray-500' : 'text-primary'}`}>
                            -₱{(subtotal - discountedAmount).toFixed(2)}
                        </p>
                    </div>
                    <div className="flex justify-between w-full">
                        <p className={`text-[25px] font-bold ${selectedProduct.length == 0 ? 'text-gray-500' : 'text-primary'}`}>
                            To Pay
                        </p>
                        <p className={`text-[25px] font-bold ${selectedProduct.length == 0 ? 'text-gray-500' : 'text-primary'}`}>
                            ₱{discountedAmount.toFixed(2)}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-[95%] bg-primary p-5 rounded-sm mx-auto">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="amount_paid" className={`text-[20px] font-bold ${selectedProduct.length == 0 ? 'text-gray-500' : 'text-white'}`}>Amount Paid</label>
                        <input 
                            id="amount-paid"
                            min={0}
                            step="0.01"
                            disabled={selectedProduct.length === 0}
                            onChange={handleAmountPaid}
                            value={amountPaid}  
                            className={`min-h-[45px] text-[20px] font-medium bg-white w-full border-1 border-gray-700 rounded-sm px-5 ${selectedProduct.length == 0 ? 'text-gray-500' : 'text-black'}`}
                        />
                    </div>
                    {amountPaid > 0 && (
                        <div className="flex flex-col justify-between gap-2 mt-5">
                            <label htmlFor="change" className={`text-[20px] font-bold ${selectedProduct.length == 0 ? 'text-gray-500' : 'text-white'}`}>Change</label>
                            <input 
                                type="text" 
                                id="change"
                                disabled
                                value={change.toLocaleString('en-PH', { 
                                    style: 'currency', 
                                    currency: 'PHP',
                                    minimumFractionDigits: 2, 
                                    maximumFractionDigits: 2 
                                })}
                                className={`min-h-[45px] text-[20px] font-medium bg-gray-200 px-5 rounded-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}
                            />
                        </div>        
                    )}
                </div>

                <div className="flex justify-end items-end h-[110px] bg-white w-full mt-6 px-15 pb-5">
                    <button 
                        type="submit"
                        disabled={!custName || amountPaid < discountedAmount || selectedProduct.length === 0}
                        className={`
                            bg-primary w-full h-[50px] text-white text-[20px] font-medium rounded-md shadow-md disabled:cursor-not-allowed shadow-black transition-colors duration-200
                            ${!custName || amountPaid < discountedAmount || selectedProduct.length === 0
                            ? 'opacity-50 cursor-default' 
                            : 'cursor-pointer hover:bg-primary-100'}`}
                    >
                        Proceed
                    </button>
                </div>
            </form>

            {placeOrder && custName && (
                <div
                    className="fixed h-screen inset-0 flex flex-col items-center justify-center z-999 overflow-y-auto pb-5 scrollbar-thin pt-10"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                >
                    <div className="min-w-[600px] max-w-[600px] bg-white py-5 pb-5 rounded-tl-sm rounded-tr-sm px-10">
                        <div className="flex flex-col items-center justify-center w-full">
                            <p className="font-bold text-[17px] font-mono">{'receipt of sale'.toUpperCase()}</p>
                            <p className="font-bold text-[20px] font-mono mb-3">{'aqua springs'.toUpperCase()}</p>
                            <div className="border-b-2 border-gray-500 border-dashed w-full"></div>
                        </div>
                        <div className="w-full flex justify-between px-20 py-5 mb-7">
                            <p className="font-mono">{formattedDate}</p>
                            <p className="font-mono">{time}</p>
                        </div>
                        <div className="w-full grid grid-cols-3 px-5">
                            <p className="font-mono">QTY</p>
                            <p className="font-mono">Name</p>
                            <p className="font-mono ml-7">AMT</p>
                        </div>
                        <div className="border-b-2 border-gray-500 border-dashed w-full"></div>
                        <div className="w-full px-5 py-5">
                            {selectedProduct.map((p) => (
                                <div key={p.id} className="w-full grid grid-cols-3 font-mono">
                                  <p>{p.quantity}</p>
                                  <p>{p.name}</p>
                                  <p className="ml-7">₱{(parseFloat(p.price) * parseFloat(p.quantity)).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-b-2 border-gray-500 border-dashed w-full"></div>
                        <div className="grid grid-cols-2 w-full p-5 mb-10">
                            <p className="font-bold font-mono text-[15px]">Subtotal: </p>
                            <p className="font-bold font-mono text-[15px] text-right">₱{subtotal.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            <p className="font-bold font-mono text-[15px]">Discount: </p>
                            <p className="font-bold font-mono text-[15px] text-right">- ₱{(subtotal - discountedAmount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            <p className="font-bold font-mono text-[20px]">Total: </p>
                            <p className="font-bold font-mono text-[20px] text-right mb-5">₱{discountedAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            <p className="font-mono text-[15px]">CASH: </p>
                            <p className="font-mono text-[15px] text-right">₱{Number(amountPaid).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            <p className="font-mono text-[15px]">CHANGE: </p>
                            <p className="font-mono text-[15px] text-right">₱{Number(change).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                        <p className="text-center font-mono text-[20px]">THANK YOU!</p>
                    </div>
                    <div className="w-[600px] flex justify-end gap-2 bg-white px-5 pb-5 rounded-bl-sm rounded-br-sm">
                        <button
                            onClick={resetSale}
                            className="flex items-center text-[14px] text-white gap-2 bg-primary px-3 py-1 rounded-sm hover:bg-primary-100 cursor-pointer"
                        >   
                            Continue
                        </button>
                        <button
                            onClick={resetSale}
                            className="flex items-center text-[14px] text-white gap-2 bg-primary px-3 py-1 rounded-sm hover:bg-primary-100 cursor-pointer"
                        >   
                            <Printer size={14} /> Print
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const Card2 = ({ products, add, selectedProducts }) => {
    return (
        <>
            {products.map(product => {
                const selected = selectedProducts.find(p => p.id === product.id);
                const availableStock = product.track_stock === 0 ? Infinity : (product.stock_quantity - (selected ? selected.quantity : 0));
                
                return (
                    <div 
                        key={product.id}
                        className={`flex flex-col gap-2 h-fit bg-white rounded-lg shadow-sm shadow-gray-400 
                                   border-2 border-primary-100 border-t-5 ${
                                    product.track_stock === 1 && availableStock <= 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                   }`}
                    >
                        <p className="flex font-bold xl:text-[15px] 2xl:text-[20px] py-3 px-4 rounded-sm border-b-1 border-dashed border-gray-500">
                            {product.name}
                        </p>
                        <p className="xl:text-[15px] 2xl:text-[15px] text-white bg-primary px-4 py-1">
                            {product.category.name}
                        </p>
                        <div className='w-full h-full p-4'>
                            <p className='xl:text-[15px] 2xl:text-[18px]'>
                                Stock: <span className={`${
                                    product.track_stock === 1 && availableStock <= 0 ? 'text-red-500' : ''
                                }`}>
                                <strong>
                                    {product.track_stock === 0 ? '∞' : availableStock} 
                                </strong>
                                <span className="text-gray-700"> {product.unit}</span></span>
                            </p>
                            <div className='flex justify-between items-center w-full mt-3'>
                                <p className="font-medium xl:text-[17px] 2xl:text-[19px]">
                                    ₱{parseFloat(product.price).toFixed(2)}
                                </p>
                                <button 
                                    className={`px-1 py-1 rounded-full ${
                                        product.track_stock === 1 && availableStock <= 0 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-primary text-gray-200 hover:bg-primary-100 cursor-pointer'
                                    }`}
                                    onClick={() => (product.track_stock === 0 || availableStock > 0) && add(product)}
                                    disabled={product.track_stock === 1 && availableStock <= 0}
                                >
                                    <Plus className='xl:w-[25px] xl:h-[25px] 2xl:w-[30px] 2xl:h-[30px]' />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
}

const Card3 = ({ product, onQuantityChange, onRemove, add, minus }) => {
    const [quantity, setQuantity] = useState(product.quantity || 1);

    const handleQuantityChange = (e) => {
        const newQty = Math.max(1, parseInt(e.target.value) || 1);
        const finalQty = product.track_stock === 0 ? newQty : Math.min(newQty, product.stock_quantity);
        setQuantity(finalQty);
        onQuantityChange(product.id, finalQty);
    };

    useEffect(() => {
        setQuantity(product.quantity || 1);
    }, [product.quantity]);

    return (
        <div className="flex items-center min-h-[30px] justify-between gap-15 w-full border-l-5 border-1 border-gray-400 
        border-l-primary bg-white rounded-sm p-3">
            <div>
                <p className="font-medium text-[15px]">{product.name}</p>
                <p className="text-[14px]">₱{parseFloat(product.price).toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-3">  
                <button 
                    type="button" 
                    onClick={() => add(product)}
                    disabled={product.track_stock === 1 && quantity >= product.stock_quantity}
                    className={product.track_stock === 1 && quantity >= product.stock_quantity ? 'opacity-50 cursor-not-allowed' : ''}
                >
                    <Plus size={28} className="p-1 bg-primary hover:bg-primary-100 text-white rounded-full cursor-pointer" />
                </button> 
                <input 
                    id="quantity"
                    className="h-[40px] w-[80px] px-2 border-1 border-gray-500 rounded-sm text-center" 
                    min="1"
                    max={product.track_stock === 0 ? '' : product.stock_quantity}
                    value={quantity}
                    onChange={handleQuantityChange}
                />
                <button 
                    type="button" 
                    onClick={() => minus(product)}
                    disabled={quantity <= 1}
                    className={quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''}
                >
                    <Minus size={28} className="p-1 bg-primary hover:bg-primary-100 text-white rounded-full cursor-pointer" />
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

export default CreateTransaction;
