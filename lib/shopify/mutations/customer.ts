export const customerCreateMutation = /* GraphQL */ `
  mutation customerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
        createdAt
      }
      userErrors {
        field
        message
      }
    }
  }
`;
