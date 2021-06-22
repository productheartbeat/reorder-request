export default function DlItem(props) {
    return (
        <div className="order-item border-t border-b-1 border-gray-200 py-2 flex">
            <span>{props.label}</span> 
            <span className="ml-auto">{props.desc}</span>
        </div>
    )
}