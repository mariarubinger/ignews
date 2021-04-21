import { signIn, useSession } from 'next-auth/client';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession(); //pra ter acesso a session do usuário

  //o usuário precisa está logado para fazer a inscrição
  async function handleSubscribe() {
    //se não existir uma session eu vou redirecionar ele pra uma autenticação com o github
    if (!session) {
      signIn('github')
      return; //pq eu quero que o código pare por aqui
    }

    //se ele estiver logado, eu vou fazer a criação da checkout session
    //chamada pra chamar essa rota
   
    try {
      const response = await api.post('/subscribe')

      

      const { sessionId } = response.data;

      const stripe = await getStripeJs()

      await stripe.redirectToCheckout({ sessionId }) //precisa passar um objeto e por isso vai ser entre {} passando o valor de sessionId que tem o mesmo nome
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}