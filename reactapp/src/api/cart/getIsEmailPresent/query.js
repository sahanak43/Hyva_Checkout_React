export const IS_EMAIL_PRESENT = `query isEmailAvailable($email: String!){
    isEmailAvailable(email: $email) {
      is_email_available
    }
  }`;
