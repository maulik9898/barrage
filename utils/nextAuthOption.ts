import { Awaitable, NextAuthOptions, RequestInternal, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
export const nextAuthOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        if (!credentials?.password) return null;
        if (credentials.password == process.env.BARRAGE_PASSWORD) {
          const user = {
            id: Buffer.from(credentials.password).toString("base64"),
          };
          console.log("login");
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }

      return token;
      ``;
    },
    session: async ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/",
  },
  session: {
    maxAge:  24 * 60 * 60,
  },
};
