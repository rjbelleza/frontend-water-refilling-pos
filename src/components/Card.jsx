import { Link } from "react-router";

const Card = ({content}) => {

    return (
        <>
            {content.map((e, index) => (
                <Link to={e.path}>
                    <div key={index} className="flex flex-col gap-3 bg-sky-300 rounded-lg p-5 hover:scale-105
                                        transition-all ease-in-out hover:bg-sky-200 shadow-[2px_2px_3px_gray]">
                        <p className="text-[15px] font-bold">{e.category}</p>
                        <div className="flex gap-4 items-center">
                            <img src={e.icon} className="h-[30px]" />
                            <p className="text-[30px] font-bold">{e.value}</p>
                        </div>
                        <div className="flex flex-col gap-2 text-[13px] font-medium">
                            <p>{e.sub1}</p>
                            <p>{e.sub2}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </>
    );
}

export default Card;
