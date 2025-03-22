
const Card1 = ({url, category, value, range, color}) => {

    return (
        <div className={`h-fit w-fit px-5 py-3 shadow-md shadow-gray-600 space-y-2 border-1 
                       border-blue-500 hover:scale-105 transition-all rounded-bl-xl rounded-br-xl
                         rounded-tl-sm rounded-tr-sm`}
             style={{backgroundImage: "url('src/assets/backgroundImages/" + url}}
        >
            <div className="w-[245px]"></div>
            <p className="font-medium w-fit px-2 py-1 rounded-sm text-[14px] text-white"
               style={{backgroundColor: color}}
            >{category}</p>
            <p className="text-[40px] font-medium text-blue-900">{value}</p>
            <p className="font-medium text-gray-700">{range}</p>
        </div>
    );
}

export default Card1;
