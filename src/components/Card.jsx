
const Card = ({content}) => {

    return (
        <>
            {content.map((e, index) => (
                <div key={index} className="flex flex-col gap-3 bg-gray-400 rounded-lg p-5 hover:scale-105
                                    transition-all ease-in-out hover:bg-gray-300">
                    <p className="text-[15px] font-medium">{e.category}</p>
                    <p className="text-[30px] font-bold">{e.value}</p>
                    <div className="flex flex-col gap-2 text-[13px] font-medium">
                        <p>{e.sub1}</p>
                        <p>{e.sub2}</p>
                    </div>
                </div>
            ))}
        </>
    );
}

export default Card;
