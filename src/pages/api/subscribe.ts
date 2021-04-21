import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";
import { query as q } from 'faunadb' 

type User = {
  ref: {
    id: string;
  }
}

//vamos retornar uma função assincrona
export default async (req: NextApiRequest, res: NextApiResponse) => {
  
  //se o método da requisição é POST
  if (req.method === 'POST') {
    const session = await getSession({ req })

  const user = await fauna.query<User>(
    q.Get(
      q.Match(
        q.Index('user_by_email'),
        q.Casefold(session.user.email)
      )
    )
  )


    const stripeCustomer = await stripe.customers.create({
      email: session.user.email, //única informação obrigatória
      // metadata
    })

    // salvar esse usuario no fauna quando a gente criar ele
    await fauna.query(
      q.Update(
        q.Ref(q.Collection('users'), user.ref.id),
        {
          data: {
            stripe_customer_id: stripeCustomer.id,
          }
        }
      )
    )

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomer.id, //id do stripe e não no banco de dados do fauna
      payment_method_types: ['card'], //métodos de pagamento que vai aceitar
      billing_address_collection: 'required', //obriga o usuário a preencher o endereço
      line_items: [ //quais são os itens que vai ter dentro do carrinho
        { price: 'price_1IdyipHiIUI1T59802vmOHEO', quantity: 1} //o id do preço vai ser estático pq só temos um produto
      ],
      mode: 'subscription', //pagamento recorrente
      allow_promotion_codes: true, //cupom de desconto
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL
    })

    return res.status(200).json({ sessionId: stripeCheckoutSession.id })
  } else {
    res.setHeader('Allow', 'POST') //allow = permitir 
    res.status(405).end('Method not allowed') //erro 405
  }
}