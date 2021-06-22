import { useState, useEffect, useContext } from 'react';
import SvgIcon from './icons';
import useSWR from 'swr';
import OrderContext from './OrderContext';

export default function ProductCheckboxes() {

	const { orderInfo } = useContext(OrderContext);
	const { data, error } = useSWR(orderInfo, orderInfo);
	if (error) return <div>Failed to load</div>
	if (!data) return <div>Loading...</div>
	const { StoreOrder } = data

	const [checkedItems, setCheckedItems] = useState({});

	const handleReorderChkBoxChange = (event) => {
		// updating an object instead of a Map
		setCheckedItems({ ...checkedItems, [event.target.name]: event.target.checked });
	}

	useEffect(() => {
		const checkedItemsKeys = Object.keys(checkedItems).filter(function(key) {
			return checkedItems[key]
		});
		localStorage.setItem("reorder_ids", JSON.stringify(checkedItemsKeys));
	}, [checkedItems]);

	return (
		<div className="space-y-4">
			{
				StoreOrder[0].StoreOrderLineItems.map((product, index) => (
					<div className="flex items-center border border-gray-200 rounded-md" key={"sku_"+index}>
						<input id={product.name || ''} onChange={handleReorderChkBoxChange} checked={checkedItems[product.variantId] || ''} name={product.variantId} type="checkbox" className="form-checkbox h-5 w-5 text-green-600 ml-4" />
						<label htmlFor={product.name} className="inline-flex items-center cursor-pointer w-full py-4">
							<div className="w-12 mx-3">
								{product.image
									?
									<img className="max-w-full m-auto" src={product.image} />
									:
									<SvgIcon role="tag" />
								}
							</div>
							<div className="flex w-full pr-4">
								<span className="text-gray-700 flex flex-col">
									<span>{product.name}</span>
									<small><strong>SKU:</strong> {product.sku}</small>
									<small><strong>Reorder Id:</strong> {product.variantId}</small>
									<small><strong>Qty:</strong> {product.quantity}</small>
								</span>
								<span className="ml-auto">
									{new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(product.price)
									}</span>
							</div>
						</label>
					</div>
				))
			}
		</div>
	);
}