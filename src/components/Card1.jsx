
const Card1 = ({ icon, category, value }) => {

    return (
        <div className="flex bg-primary rounded-lg p-5 space-x-3">
            <div className="flex items-center h-full">
                <p className="h-fit bg-white text-primary p-3 rounded-sm">{icon}</p>
            </div>
            <div className="flex flex-col justify-center text-white space-y-1">
                <p className="font-light text-[14px]">{category}</p>
                <p className="font-medium text-[23px]">{value}</p>
            </div>
        </div>
    );
}

export default Card1;
