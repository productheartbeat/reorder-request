import React from "react";
import StepHeading from "../components/stepHeading"
import { withRouter } from 'next/router'
import useSWR from 'swr';
import { gql } from 'graphql-request'
import { CorsoGraphQLClient } from '../queries/graphqlClient';

const CLAIM_QUERY = gql`
  query CLAIM_QUERY($shippingProtectionClaimId_eq: Int = 0) {
    Claim: ShippingProtectionClaim(where: {shippingProtectionClaimId: {_eq: $shippingProtectionClaimId_eq}}) {
      claimReason
      claimStatus
      createdOn
      noteFromCustomer
      statusChangedOn
      shippingProtectionClaimId
      originalStoreOrderId
      reorderStoreOrderId
      OriginalStoreOrder {
        customerEmail
        Store {
          name
          url
        }
      }
    }
  }
`

const Confirmation = (props) => {

    const claimFetcher = async () => {

      // Get data from local storage
      const claimId = props.router.query.claimId;

      const CLAIM_VARIABLES = {
        "shippingProtectionClaimId_eq": claimId
      }

      const claimData = await CorsoGraphQLClient.request(CLAIM_QUERY, CLAIM_VARIABLES);
      
      return claimData;

    }

    const { data: claimDataSwr, error: claimErrorSwr } = useSWR("CLAIM_QUERY", claimFetcher, {
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Never retry on 404.
        if (error.status === 404) return
    
        // Only retry up to 10 times.
        if (retryCount >= 10) return
    
        // Retry after 5 seconds.
        setTimeout(() => revalidate({ retryCount }), 5000)
      }
    })

    // Handle loading and error states
    if ( claimErrorSwr ) return <div>Failed to load</div>
    if ( !claimDataSwr ) return <div>Loading...</div>

    const { Claim } = claimDataSwr;

    // TO DO - Figure out if we want to have personalized Corso concierge profiles.
    const serviceProfileUrl = "https://images.unsplash.com/profile-1489175036767-c3b81d0e32d7?dpr=1&auto=format&fit=crop&w=150&h=150&q=60&crop=faces&bg=fff";
    const serviceName = "Melissa";

  return (
    <div>
      {
        Claim.map((claim,index) => (
          <div key={index}>
            <StepHeading number="6" title="Request Received Perfectly" subtitle={"I got your info. Here is your claim#: "+claim.shippingProtectionClaimId} />
            <div>
              <div className="space-y-4 text-sm">
                <p>Here's what happens next. I just sent you an email to {claim.OriginalStoreOrder.customerEmail} with this confirmation.</p>
                <p>We have a quick turnaround on requests, so you should from me within 24 hours. We know shipping issues are frustrating, so I'm on this. I'll be in touch.</p>
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
              <div className="mt-16 space-y-6 self-start">
                <a target="_blank" href={"https://"+claim.OriginalStoreOrder.Store.url} className="bg-green-600 border text-white hover:bg-green-700 hover:text-white rounded-md px-4 py-2 w-full justify-center flex tems-center disabled:opacity-50 relative">
                  {claim.OriginalStoreOrder.Store.name+" Website"}
                </a>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default withRouter(Confirmation);
