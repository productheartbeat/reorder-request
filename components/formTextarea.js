import Link from "next/Link"

export default function FormTextarea(props) {
	return (
		<div className="w-full">
			<div className="flex items-center">
				<label htmlFor={props.id} className="block mb-2 text-sm">{props.label}</label>
			</div>
			<textarea type="text" name={props.name} id={props.id} value={props.value} placeholder={props.placeholder} onChange={props.onChange ? props.onChange : null} required={props.required == "true" ? "required" : ""} className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-100 focus:border-green-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500">
			</textarea>
		</div>
	)
}