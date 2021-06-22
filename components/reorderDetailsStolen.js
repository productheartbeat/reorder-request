import React, { useContext } from "react";
import { withRouter } from 'next/router'
import StepHeading from "./stepHeading"
import Layout from "./layout"
import Button from "./button"
import SvgIcon from "./icons"

const ReorderDetailsStolen = (props) => {

	const times = 1;

	return (
		<>
			<div>
				<StepHeading number="4" title="Stolen Package" subtitle="Almost there. One last step." />
				{times < 2
				?
					<div>
						<p className="mb-8">Porch pirates are the worst. Since we have your tracking information here, let's review it real quick just to make sure your package actually got delivered.</p>
						<div>
							<Button type="button" label="View Tracking Info" outline path="">
								<SvgIcon role="truck" />
							</Button>
						</div>
					</div>
				:
					<div>
						<p className="mb-8">Porch pirates are the worst. We want to make things right and we don't want to make you jump through more hoops, but we need a copy of a police report to file another reorder request.</p>
						<p className="mb-8">If you don't have that yet, you can check back and upload it here.</p>
						<div>
							<Button type="button" label="Police Report" outline path="">
								<SvgIcon role="file" />
							</Button>
							<input className="cursor-pointer absolute block opacity-0 top-0 w-full h-full" type="file" name="theftPoliceReport" />
						</div>
					</div>
				}
			</div>
		</>
	)
}

export default withRouter(ReorderDetailsStolen);
