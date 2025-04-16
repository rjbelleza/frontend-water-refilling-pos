
const Card1 = ({ icon, category, value, range }) => {

    return (
        <div className="flex bg-blue-950 rounded-lg p-5 space-x-3">
            <div className="flex items-center h-full">
                <p className="h-fit bg-white text-primary p-3 rounded-sm">{icon}</p>
            </div>
            <div className="flex flex-col justify-center text-white space-y-1">
                <p className="font-light">{category}</p>
                <p className="font-medium text-[23px]">{value}</p>
                <p className="w-fit bg-white text-primary text-[12px] font-medium px-2 py-1 rounded-sm">{range}</p>
            </div>
        </div>
    );
}

export default Card1;
