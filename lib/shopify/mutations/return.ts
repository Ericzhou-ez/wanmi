export const returnRequestMutation = /* GraphQL */ `
  mutation returnRequest($input: ReturnRequestInput!) {
    returnRequest(input: $input) {
      return {
        id
        name
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;
