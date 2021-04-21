import { query as q } from 'faunadb' //q é como se fosse o apelido de query só pra facilitar na escrita

import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

import { fauna } from '../../../services/fauna'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user'
    }),
  ],
  
  callbacks: {
    async signIn(user, account, profile) {
      const { email } = user
      
      try {
        await fauna.query(
        //SE NÃO EXISTE um usuário com esse email
        //essa syntax chama GraphQL
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            ),
            //então vai cria-lo no banco de dados
            q.Create(
              q.Collection('users'),
              { data: { email }}
            ),
            //senão busca o usuário que bate com esse index aqui
            q.Get(  //select
              q.Match(
              q.Index('user_by_email'),
              q.Casefold(user.email)
            )
          )
        )
      )
      return true 
      } catch { 
        return false
      } 
    },
  }
})