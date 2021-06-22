import Layout from "../components/layout"
import StepHeading from "../components/stepHeading"
import Button from "../components/button"

export default function StoreMessage() {

  const merchantLogoUrl = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogos-download.com%2Fwp-content%2Fuploads%2F2019%2F11%2FStance_Logo.png&f=1&nofb=1";
  const newOrderId = "987654321";
  const merchant = "Stance";
  const merchantUrl = "https://www.stance.com";
  const result = "auto";
  const claimId = "888444";
  const serviceProfileUrl = "https://images.unsplash.com/profile-1489175036767-c3b81d0e32d7?dpr=1&auto=format&fit=crop&w=150&h=150&q=60&crop=faces&bg=fff";
  const serviceName = "Melissa";
  const serviceEmail = "melissa@corso.com";
  const orderEmail = "antaresjhw@gmail.com";

  return (
    <Layout>
      <StepHeading number="6" title="Request Received Perfectly" subtitle="I got your info. Here is your claim#: 8884567" />
        {result == "auto"
        ?
          <div>
            <div className="space-y-4 text-sm">
              <p>Great news. I went ahead and reordered your product. We will also cover the carbon offsets for this shipment.</p>
              <p>Here's your new order number: <strong>{newOrderId}.</strong> You'll be able to see your new order details in your <a href={merchantUrl} className="text-green-700">{merchant} account.</a></p>
              <p className="text-sm mt-8">Email me at {serviceEmail} if you have any questions.</p>
            </div>
            {/*<div className="mt-8">
              <div className="border border-green-600 rounded bg-gray-50 p-8">
                <div className="mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-green-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="my-8 text-sm italic">Offset your shipping carbon by sending a small amount to Corso via Venmo.</p>
                <Button label="Offset Carbon ($0.50)" path="/#" helperText="Payment Via Venmo" />
              </div>
            </div>*/}
            <div className="flex items-center flex-row pt-8">
              <div className="mr-4" style={{width: "80px"}}>
                <img className="rounded-full" src={serviceProfileUrl} />
              </div>
              <div className="w-full text-sm">
                <p>{serviceName}</p>
                <p>Your Corso Concierge</p>
              </div>
            </div>
          </div>
        :
          <div>
            <div className="space-y-4 text-sm">
              <p>Here's what happens next. I just sent you an email to {orderEmail} with this confirmation.</p>
              <p>We have a quick turnaround, so you should from me within 24 hours. We know shipping issues are frustrating, so I'm on this. I'll be in touch.</p>
              {/*<div className="mt-8">
                <div className="border border-green-600 rounded bg-gray-50 p-4">
                  <div className="mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-green-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="my-4 text-sm italic">Offset any shipping carbon by sending a small amount to Corso via Venmo.</p>
                  <Button label="Offset Carbon ($0.50)" path="/#" helperText="Payment Via Venmo" />
                </div>
              </div>*/}
              <div className="flex items-center flex-row pt-4">
                <div className="mr-4" style={{width: "80px"}}>
                  <img className="rounded-full" src={serviceProfileUrl} />
                </div>
                <div className="w-full text-sm">
                  <p>{serviceName}</p>
                  <p>Your Corso Concierge</p>
                </div>
              </div>
            </div>
          </div>
        }
    </Layout>
  )
}
