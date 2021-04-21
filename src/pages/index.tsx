import { GetStaticProps } from 'next';
import Head from 'next/head'
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';
import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: number,
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}> 
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>New about <br />the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding"/>
      </main>
    </>
  )
}


export const getStaticProps: GetStaticProps = async () => {
  // retrieve siginifica que eu quero buscar um só
  const price = await stripe.prices.retrieve('price_1IdyipHiIUI1T59802vmOHEO') //id do preço

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  };
 
  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, //vai atualizar o arquivo estático salvo pelo Next há cada 24h
  }
}