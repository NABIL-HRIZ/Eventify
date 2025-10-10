import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm.";
const stripePromise = loadStripe("pk_test_51OmxxCFMrNvJHi85lITE0lzZbtF2p4rtVQDOeXdBRIIIWa5SjTeX9TL7TLMZH6I6PyomHXIgxXwYSqt81GqSZiAF00yXRbVvzP"); // clé publique

export default function StripeContainer({ amount }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} />
    </Elements>
  );
}
