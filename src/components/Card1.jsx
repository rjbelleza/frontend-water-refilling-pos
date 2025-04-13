
const Card1 = ({ icon, category, value, range }) => {

    return (
        <div className="h-fit w-fit px-5 py-2 pb-4 shadow-md shadow-gray-400 border border-gray-400 space-y-2 hover:scale-105 transition-all rounded-md"
        >
            <div className="w-[245px]"></div>
            <div className="flex justify-between">
                <p className="font-medium w-fit h-fit px-2 py-1 rounded-sm text-[12px] text-white bg-blue-900"
                >{category}</p>
                <div className="bg-blue-700 text-white rounded-full p-2 mr-3">{icon}</div>
            </div>
            <p className="text-[30px] font-medium text-blue-900">{value}</p>
            <p className="font-medium text-gray-700 text-[13px]">{range}</p>
        </div>
    );
}

export default Card1;
