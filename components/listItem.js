export default function ListItem(props) {
    return (
        <div className="flex items-center border border-gray-200 rounded-md p-2">
            <div className="w-12 mr-3">
                {props.image
                ?
                    <img className="max-w-full m-auto" src={props.image} />
                :
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                }
            </div>
            <div className="flex flex-col ml-1">
                <span>{props.title}</span>
                <small>{props.subtitle}</small>
                <small>{props.desc}</small>
            </div>
            <div className="ml-auto self-start mr-2">
                {props.end}
            </div>
        </div>
    )
}