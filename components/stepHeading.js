import SvgIcon from "./icons";

export default function StepHeading(props) {
	return (
		<div>
			<div className="text-gray-800 w-full mb-2">
				<h1 className="text-xl flex items-center">
					<span>{props.number}</span>
					{props.number
						?
						<span className="mx-2">
							<SvgIcon role="arrow-right" />
						</span>
						:
						""
					}
					<span>{props.title}</span>
				</h1>
			</div>
			<div>
				<p className="mb-8 italic text-sm">{props.subtitle}</p>
			</div>
		</div>
	)
}