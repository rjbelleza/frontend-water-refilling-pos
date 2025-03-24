import Card2 from "./Card2";

const CreateTransaction = () => {
    const categories = ["Container", "Water"];

    const products = [
        {id: 1, name: "5-Gallon Bottle", category: "Water", price: 30.00, stock: 100},
        {id: 2, name: "3-Gallon Bottle", category: "Water", price: 25.00, stock: 100},
        {id: 3, name: "1-Gallon Bottle", category: "Water", price: 20.00, stock: 200},
        {id: 4, name: "5-Gallon Container", category: "Container", price: 15.00, stock: 150},
        {id: 4, name: "500ml Container", category: "Container", price: 15.00, stock: 150},
        {id: 4, name: "250ml Bottle", category: "Water", price: 15.00, stock: 150},
    ];

    return(
        <div className="flex h-[550px] w-full">

            <div className="h-full w-full overflow-auto">
                <div className="flex h-[80px] gap-4 bg-white sticky top-0">
                    <input 
                        type="text" 
                        placeholder="Search product name..." 
                        className="border-1 border-gray-500 px-5 py-1 rounded-sm h-[40px]" 
                    />
                    
                    <select className="border-1 border-gray-500 px-3 rounded-sm h-[40px]">
                        <option>All</option>
                        {categories ? categories.map((category, index) => (
                            <option key={index}>{category}</option>
                        )) : (
                            <option>All</option>
                        )}
                    </select>
                </div>

                <div className="grid grid-cols-3 gap-9 w-[95%] p-5 overflow-auto">
                    <Card2 products={products} />
                </div>
            </div>

            <div className="h-full w-[650px] bg-primary-500 rounded-md">

            </div>
        </div>
    );
}

export default CreateTransaction;
