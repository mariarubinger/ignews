import { loadStripe } from '@stripe/stripe-js'

//exportar uma função chamada getStripeJs
export async function getStripeJs() {
  //Publishable key 
  const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
  return stripeJs
}