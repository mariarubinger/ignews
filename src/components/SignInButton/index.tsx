import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { signIn, signOut, useSession } from 'next-auth/client' //função que faz a autenticação do usuário

import styles from './styles.module.scss';

export function SignInButton() {
  //const isUserLoggedIn = true; //varíavel se o usuário está logado
  const [session] = useSession()

  console.log(session); //para vê qual é o valor da variável toda vez que ela mudar

 //o return por si só é algo CONDICIONAL, se o usuário estiver logado em um sessão ? o ícone ficará verde e com o nome : se não vai ficar amarelo
   return session ? (
    <button
      type="button"
      className={styles.signInButton} 
      onClick={() => signOut()}
    >
      <FaGithub color="#04d361" /> 
      {session.user.name}
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button
      type="button"
      className={styles.signInButton}  
      onClick={() => signIn('github')}
    >
    <FaGithub color="#eba417" /> 
    Sign in with GitHub
    </button>
  )
}
