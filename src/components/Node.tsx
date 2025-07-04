type Input = {
    id: string
    type: string,
    name: string,
    isSelected: boolean,
    nodeClicked: Function
}

export default function node(props: Input) {
    return (
        <>
            <div className={`node-${props.name[props.name.length - 1].toLowerCase()}`}
                onClick={() => props.nodeClicked(props.id)}
                style={{backgroundColor: props.isSelected ? "goldenrod" : undefined}}
            >{firstLettertoUpperCase(props.type)}
                <p>{props.name}</p>
            </div>
        </>
    )
}

function firstLettertoUpperCase(s: string) {
    return s[0].toUpperCase().concat(s.slice(1))
}
