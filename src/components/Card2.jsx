import { Plus } from 'lucide-react';

const Card2 = ({products, add}) => {

    return (
        <>
            {products ? products.map(product => (
                <div className="flex flex-col gap-2 h-fit w-[170px] p-5 bg-white rounded-lg shadow-md shadow-gray-500 
                                border-1 border-gray-500 border-t-5 border-t-sky-700"
                     key={product.id}
                >
                    <p className="card-text font-bold text-[14px]">{product.name}</p>
                    <p className="text-[11px] text-gray-500 ">{product.category}</p>
                    <p className="font-medium text-[14px]">₱{product.price.toFixed(2)}</p>
                    <div className='flex justify-between items-center w-full mt-3'>
                        <p className='text-[13px]'>Stock: <span className="font-bold text-[13px]">{product.stock}</span></p>
                        <button className="px-3 py-1 bg-blue-700 shadow-md shadow-gray-700 rounded-md 
                                        text-gray-200 hover:bg-blue-500 cursor-pointer"
                                onClick={() => add(product)}
                        >
                            <Plus size={20} />
                        </button>
                    </div>
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
