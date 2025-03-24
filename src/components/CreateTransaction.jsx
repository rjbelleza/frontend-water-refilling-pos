

const CreateTransaction = () => {
    const categories = ["Container", "Water"];

    return(
        <div className="h-full w-full">

            {/* Filter products */ }
            <div className="flex gap-4 w-full">
                <input type="text" placeholder="Search product name..." className="border-1 border-gray-500 px-5 py-1 rounded-sm" />
                
                <select className="border-1 border-gray-500 px-3 rounded-sm">
                    <option>All</option>
                    {categories ? categories.map((category, index) => (
                        <option key={index}>{category}</option>
                    )) : (
                        <option>All</option>
                    )}
                </select>
            </div>
            
            <div>

            </div>
        </div>
    );
}

export default CreateTransaction;
