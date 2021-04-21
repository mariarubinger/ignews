//arquivo que vai definir a conexão com a API do stripe

import Stripe from 'stripe' //biblioteca para eu lidar diretamente com a API do stripe
import { version } from '../../package.json'

export const stripe = new Stripe(
  process.env.STRIPE_API_KEY, //primeiro parâmetro: precisa colocar qual é a chave
  {
    apiVersion: '2020-08-27', //segundo parâmetro
    appInfo: { //informações de metadados
      name: 'Ignews',
      version
    },
  }
)

//STRIPE_API_KEY é uma variável de ambiente secreta, ela não pode ficar pública