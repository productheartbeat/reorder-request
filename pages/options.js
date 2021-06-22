import Layout from "../components/layout"
import StepHeading from "../components/stepHeading"
import Button from "../components/button"
import Router from 'next/router';

export default function Options() {

  const handleReorderOption=(e)=>{
    e.preventDefault();
    localStorage.setItem('claim_type', 'reorder');
    Router.push({
      pathname: '/review',
      query: {reason: localStorage.getItem("claim_reason"), type: "reorder"}
    });
  }

  const handleRefundOption=(e)=>{
    e.preventDefault();
    localStorage.setItem('claim_type', 'refund');
    Router.push({
      pathname: '/review',
      query: {reason: localStorage.getItem("claim_reason"), type: "refund"}
    });
  }

  return (
    <Layout cardFooter="true" cardFooterContent="Stance partners with Corso to provide Green Shipping Protection">
      <StepHeading title="Options" />
      <div>
        <p>Rather than have your package re-shipped, you can also request a refund.</p>
      </div>
      <div className="mt-16">
        <div className="space-y-4">
          <Button label="Stick with the reorder" path="/review" onClick={handleReorderOption} />
          <Button label="Request a refund" path="/review" outline onClick={handleRefundOption} />
        </div>
      </div>
    </Layout>
  )
}
