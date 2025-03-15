
const Card = ({content}) => {

    return (
        <>
            {content.map((e, index) => (
                <div key={index}>
                    <p>{e.category}</p>
                    <p>{e.value}</p>
                    <div>
                        <p>{e.sub1}</p>
                        <p>{e.sub2}</p>
                    </div>
                </div>
            ))}
        </>
    );
}

export default Card;
