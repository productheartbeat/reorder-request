import Link from "next/Link"


export default function Button(props) {
    return (

            <div>
                <button type={props.type} onClick={props.onClick} disabled={props.disabled ? "disabled" : ""} className=
                    {props.outline
                    ?
                        "bg-white border border-green-600 text-green-600 hover:bg-green-700 hover:text-white rounded-md px-4 py-2 w-full justify-center flex tems-center disabled:opacity-50 relative"
                    :
                    props.link
                    ?
                        "bg-white border border-white text-green-600 hover:bg-green-700 hover:text-white rounded-md px-4 py-2 w-full justify-center flex tems-center disabled:opacity-50 relative"
                    :
                        "bg-green-600 border text-white hover:bg-green-700 hover:text-white rounded-md px-4 py-2 w-full justify-center flex tems-center disabled:opacity-50 relative"
                    }
                >
                    <span>{props.label}</span>
                    {props.children}
                </button>
                {props.helperText
                ?
                    <div className="flex items-center justify-center mt-2">
                        <span className="ml-1 text-xs italic">{props.helperText}</span>
                    </div>
                :
                    ""
                }
            </div>

    )
}