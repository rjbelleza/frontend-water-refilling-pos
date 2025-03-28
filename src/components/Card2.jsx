
const Card2 = ({products, add}) => {

    return (
        <>
            {products ? products.map(product => (
                <div className="flex flex-col gap-2 h-fit w-[210px] p-6 bg-white rounded-sm shadow-md shadow-gray-500 
                                border-1 border-gray-500 border-t-8 border-t-blue-700"
                     key={product.id}
                >
                    <p className="card-text font-bold text-[17px]">{product.name}</p>
                    <p className="text-[13px]">{product.category}</p>
                    <p className="font-medium text-[18px]">₱{product.price.toFixed(2)}</p>
                    <p>Stock: <span className="font-medium">{product.stock}</span></p>
                    <button className="px-5 py-1 bg-blue-700 shadow-md shadow-gray-700 rounded-sm 
                                     text-gray-200 hover:bg-blue-500 cursor-pointer"
                            onClick={() => add(product)}
                    >
                        Select Product
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
