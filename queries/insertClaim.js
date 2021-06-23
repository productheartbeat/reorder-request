const insertClaim = `
  mutation INSERT_CLAIM($claimReason: String!, $originalStoreOrderId: Int!, $noteFromPassenger: String = "") {
    insertClaim: insert_ShippingProtectionClaim_one(object: {claimReason: $claimReason, originalStoreOrderId: $originalStoreOrderId, noteFromPassenger: $noteFromPassenger}, on_conflict: {constraint: pk_ship_protect_claim_ship_protect_claim_id}) {
      claimReason
      noteFromPassenger
      originalStoreOrderId
      shippingProtectionClaimId
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

export default insertClaim;
