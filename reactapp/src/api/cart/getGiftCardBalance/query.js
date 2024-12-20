export const GIFT_CARD_BALANCE = `query getGiftCardInfo($code: String!) {
    giftCardAccount(input: {gift_card_code: $code}){
      code
      balance {
        currency
        value
      }
      expiration_date
    }
  }`;
