export const APPLE_PAY_MUTATION = `
    mutation createCheckoutComCardApplePayPlaceOrder(
    $cart_id: String!,
    $version: String!,
    $signature: String!,
    $data: String!,
    $publicKeyHash: String!,
    $ephemeralPublicKey: String!,
    $transactionId: String!,
    $displayName: String!,
    $network: String!,
    $type: String!,
    $transactionIdentifier: String!

) {
    createCheckoutComCardApplePayPlaceOrder(
        input: {
            cart_id: $cart_id,
            cardToken: {
                paymentData: {
                    version: $version,
                    signature: $signature,
                    data: $data,
                    header: {
                        publicKeyHash: $publicKeyHash,
                        ephemeralPublicKey: $ephemeralPublicKey,
                        transactionId: $transactionId
                    }
                },
                paymentMethod: {
                    displayName: $displayName,
                    network: $network,
                    type: $type
                },
                transactionIdentifier: $transactionIdentifier
            }
        }
    ) {
        success
        message
        responseCode
        url
        order {
            number
        }
    }
}
`;

export const VALIDATE_MERCHANT = `
        query {
          validateCheckoutComApplePay {
            response
          }
        }
    `;
