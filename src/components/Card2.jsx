import { Plus } from 'lucide-react';

const Card2 = ({products, add}) => {

    return (
        <>
            {products && products.map(product => (
                <div 
                    key={product}
                    className="flex flex-col gap-2 h-fit p-5 bg-white rounded-lg shadow-sm shadow-gray-400 
                                border-2 border-blue-800"
                >
                    <p className="flex flex-nowrap card-text font-bold xl:text-[17px] 2xl:text-[20px] bg-blue-200 px-5 py-2 rounded-full">{product.name}</p>
                    <p className="xl:text-[13px] 2xl:text-[15px] text-gray-500">{product.category}</p>
                    <p className='xl:text-[15px] 2xl:text-[18px]'>Stock: <span className="font-bold">{product.stock}</span></p>
                    <div className='flex justify-between items-center w-full mt-3'>
                        <p className="font-medium xl:text-[17px] 2xl:text-[19px]">₱{product.price.toFixed(2)}</p>
                        <button className="px-1 py-1 bg-blue-700 text-gray-200 hover:bg-blue-500 cursor-pointer rounded-full"
                                onClick={() => add(product)}
                        >
                            <Plus className='xl:w-[25px] xl:h-[25px] 2xl:w-[30px] 2xl:h-[30px]' />
                        </button>
                    </div>
                </div>
            ))}
        </>
    );
}

export default Card2;
