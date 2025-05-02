import { Plus } from 'lucide-react';

const Card2 = ({products, add}) => {

    return (
        <>
            {products && products.map(product => (
                <div 
                    key={product.id}
                    className="flex flex-col gap-2 h-fit bg-white rounded-lg shadow-sm shadow-gray-400 
                               border-2 border-primary-100 border-t-5"
                >
                    <p className="flex font-bold xl:text-[15px] 2xl:text-[20px] py-3 px-4 rounded-sm border-b-1 border-dashed border-gray-500">
                        {product.name}
                    </p>
                    <div className='w-full h-full p-4'>
                        <p className="xl:text-[15px] 2xl:text-[15px] text-gray-500">{product.category.name}</p>
                        <p className='xl:text-[15px] 2xl:text-[18px]'>Stock: <span className="font-bold">{product.stock}</span></p>
                        <div className='flex justify-between items-center w-full mt-3'>
                            <p className="font-medium xl:text-[17px] 2xl:text-[19px]">₱{product.price.toFixed(2)}</p>
                            <button className="px-1 py-1 bg-primary text-gray-200 hover:bg-primary-100 cursor-pointer rounded-full"
                                    onClick={() => add(product)}
                            >
                                <Plus className='xl:w-[25px] xl:h-[25px] 2xl:w-[30px] 2xl:h-[30px]' />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default Card2;
