export default function List(props) {
    return (
        <div className="text-sm">
            <div className="space-y-2 text-sm my-4">
                {props.children}
            </div>
        </div>
    )
}