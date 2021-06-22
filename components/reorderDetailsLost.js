import React from "react";
import { withRouter } from 'next/router'
import Layout from "./layout"
import StepHeading from "./stepHeading"
import Button from "./button"
import SvgIcon from "./icons"


const ReorderDetailsLost = () => {

	const days = 7;

	return (
		<>
			<div>
				<StepHeading number="4" title="Lost Package" subtitle="Almost there. One last step." />
				{ days < 5
					?
					<div>
						<p className="mb-8">It's been {days} days since you ordered your package. Sometimes shipping goes slower than expected. We like to wait at least 5 days before it is considered lost. You can view your tracking information below.</p>
						<p className="mb-8">If you still haven't recieved your package after 5 days, please check back.</p>
						<Button type="button" label="View Tracking Info" outline path="">
							<SvgIcon role="truck" />
						</Button>
					</div>
					:
					<div>
						<p className="mb-8">Millions of packages get delivered each day. It's rare, but sometimes they get lost. Since we have your tracking information here, let's review it real quick just to make sure your package absolutely, 100%, for sure isn't going to make it.</p>
						<div>
							<div>
								<Button type="button" label="View Tracking Info" outline path="">
									<SvgIcon role="truck" />
								</Button>
							</div>
						</div>
					</div>
				}
			</div>
		</>
	)
}

export default withRouter(ReorderDetailsLost);
