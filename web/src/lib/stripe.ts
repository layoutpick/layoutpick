import Stripe from "stripe";

// Lazily instantiate so a missing key fails at request time (with a clear
// message) rather than crashing the build during module collection.
let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    client = new Stripe(key);
  }
  return client;
}
