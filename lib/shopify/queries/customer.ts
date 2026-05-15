export const findCustomerByEmailQuery = /* GraphQL */ `
  query findCustomerByEmail($query: String!) {
    customers(first: 1, query: $query) {
      edges {
        node {
          id
          email
          firstName
          lastName
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const getCustomerOrdersQuery = /* GraphQL */ `
  query getCustomerOrders($customerId: ID!, $first: Int = 20) {
    customer(id: $customerId) {
      id
      email
      firstName
      lastName
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            name
            processedAt
            displayFinancialStatus
            displayFulfillmentStatus
            currentTotalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            lineItems(first: 50) {
              edges {
                node {
                  id
                  title
                  quantity
                  variant {
                    id
                    title
                    image {
                      url
                      altText
                      width
                      height
                    }
                    product {
                      id
                      handle
                      title
                      tags
                      productType
                      vendor
                    }
                  }
                }
              }
            }
            returnableFulfillments(first: 10) {
              edges {
                node {
                  id
                  returnableFulfillmentLineItems(first: 50) {
                    edges {
                      node {
                        quantity
                        fulfillmentLineItem {
                          id
                          lineItem {
                            id
                            title
                            quantity
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            returns(first: 10) {
              edges {
                node {
                  id
                  name
                  status
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const getCustomerOrdersBySearchQuery = /* GraphQL */ `
  query getCustomerOrdersBySearch($query: String!, $first: Int = 20) {
    orders(first: $first, query: $query, sortKey: PROCESSED_AT, reverse: true) {
      edges {
        node {
          id
          name
          processedAt
          displayFinancialStatus
          displayFulfillmentStatus
          currentTotalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          lineItems(first: 50) {
            edges {
              node {
                id
                title
                quantity
                variant {
                  id
                  title
                  image {
                    url
                    altText
                    width
                    height
                  }
                  product {
                    id
                    handle
                    title
                    tags
                    productType
                    vendor
                  }
                }
              }
            }
          }
          returnableFulfillments(first: 10) {
            edges {
              node {
                id
                returnableFulfillmentLineItems(first: 50) {
                  edges {
                    node {
                      quantity
                      fulfillmentLineItem {
                        id
                        lineItem {
                          id
                          title
                          quantity
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          returns(first: 10) {
            edges {
              node {
                id
                name
                status
              }
            }
          }
        }
      }
    }
  }
`;
