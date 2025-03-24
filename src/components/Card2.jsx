
const Card2 = ({products}) => {

    return (
        <>
            {products ? products.map(product => (
                <div className="flex flex-col gap-2 h-fit w-fit p-6 bg-white rounded-sm shadow-md shadow-gray-500 
                                border-1 border-gray-500"
                >
                    <div className="w-[170px]"></div>
                    <p className="card-text font-bold text-[20px]">{product.name}</p>
                    <p className="text-[13px]">{product.category}</p>
                    <p className="font-medium text-[18px]">₱{product.price.toFixed(2)}</p>
                    <p>Stock: <span className="font-medium">{product.stock}</span></p>
                    <button className="px-5 py-1 bg-blue-500 shadow-md shadow-gray-700 rounded-sm 
                                     text-gray-200 hover:bg-blue-400 cursor-pointer"
                    >
                        Add Product
                    </button>
                </div>
            )) : (
                <div className="flex h-full w-full">
                    <p className="text-[17px]">There are no products available.</p>
                </div>
            )}
        </>
    );
}

export default Card2;
