import React, { useContext } from "react";
import { withRouter } from 'next/router'
import StepHeading from "../components/stepHeading"
import ProductCheckboxes from "./productCheckboxes";
import Button from "../components/button"
import useSWR from 'swr';
import OrderContext from '../components/OrderContext';

const ReorderDetailsDamaged = ({ props }) => {

	return (
		<>	
			<div>
				<StepHeading number="4" title="Damaged Package" subtitle="Almost there. One last step." />
				<div>
					<div className="mb-4">
						<h5>Which items got damaged?</h5>
						<div className="mt-4">
							<ProductCheckboxes />
						</div>
					</div>
					<div>
						<div className="relative">
							<Button type="button" label="Add a photo of the damage" outline />
							<input className="cursor-pointer absolute block opacity-0 top-0 w-full h-full" type="file" name="shippingDamagePhoto" />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default withRouter(ReorderDetailsDamaged);
