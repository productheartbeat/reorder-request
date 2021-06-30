import Layout from "../components/layout";
import StepHeading from "../components/stepHeading";
import OrderIdLookup from "../components/orderIdLookup";

export default function Home() {
  return (
    <div>
      <StepHeading title="Green Shipping Protection" subtitle="Hello there! We are here to protect your shipment because sometimes packages get damaged, lost, or stolen. If you've had issues, just enter your order number to get started." />
        <div>
          <OrderIdLookup />
        </div>
    </div>
  )
}
