const orderQuery = `
  query ORDER_QUERY($idFromPlatform_like: String = "0") {
    StoreOrder(where: {idFromPlatform: {_like: $idFromPlatform_like}}) {
      idFromPlatform
      storeOrderId
      createdOn
      orderTotal
      customerEmail
      Customer {
        firstName
      }
      Store {
        name
      }
      ShippingAddress {
        postalCode
      }
      StoreOrderLineItems(where: {vendor: {_nilike: "Corso, LLC"}}) {
        name
        sku
        price
        variantId
        quantity
        storeOrderLineItemId
      }
      ShippingProtectionClaims_aggregate {
        aggregate {
          count
        }
      }
    }
    StoreOrderLineItem_aggregate(where: {storeOrder: {idFromPlatform: {_like: $idFromPlatform_like}}}) {
      aggregate {
        count
      }
    }
  }
`

export default orderQuery;
