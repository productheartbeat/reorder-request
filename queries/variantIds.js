const variantIdsQuery = `
  query VARIANT_QUERY($idFromPlatform_like: String = "0") {
    Order: StoreOrder(where: {idFromPlatform: {_like: $idFromPlatform_like}}) {
      Variants: StoreOrderLineItems(where: {vendor: {_nilike: "Corso, LLC"}}) {
        variantId
      }
    }
  }
`

export default variantIdsQuery;