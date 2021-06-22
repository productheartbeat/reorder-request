import Router from 'next/router';

const goToPath = (pageName) => {
	Router.push({
		pathname: pageName,
		query: { page: pageName }
	});
}

export default function FormTextInput(props) {
	return (
		<div className="w-full">
			<div className="flex items-center">
				<label htmlFor={props.id} className="block mb-2 text-sm">{props.label}</label>
				{props.helpLink ? <span className="ml-auto text-xs text-green-600 mb-2 cursor-pointer" onClick={() => Router.push({pathname: "/"+props.helpLinkPage, query: {page: props.helpLinkPage}})}>{props.helpLinkText}</span> : ""}
			</div>
			<input type="text" name={props.name} id={props.id} placeholder={props.placeholder} onChange={props.onChange ? props.onChange : null} required={props.required == "true" ? "required" : null} className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-100 focus:border-green-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500" />
		</div>
	)
}