import Layout from "../components/layout";
import StepHeading from "../components/stepHeading";
import OrderIdLookup from "../components/orderIdLookup";

export default function Home() {
  return (
    <Layout cardFooter cardFooterContent={["Brands everywhere partner with Corso for Green Shipping Protection. ", <a className="text-green-700 font-bold" href="https://www.corso.com" target="blank">Learn More</a>]}>
      <StepHeading title="Green Shipping Protection 3896570478791 " subtitle="Hello there! We are here to protect your shipment because sometimes packages get damaged, lost, or stolen. If you've had issues, just enter your order number to get started." />
        <div>
          <OrderIdLookup />
        </div>
    </Layout>
  )
}
