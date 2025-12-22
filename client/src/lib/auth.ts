import { SERVER_URL } from "@/lib/serverUrl";
import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  useSecureCookies: true,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      authorize: async (credentials) => {
        const res = await fetch(`${SERVER_URL}/api/users/login`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(credentials),
        });
        if (!res.ok) {
          return null;
        }
        const user: User = await res.json();

        const cook = res.headers
          .getSetCookie()
          .find((cookie) => cookie.startsWith("access"))
          ?.split(";");

        const jwtCook = cook?.find((item) => item.trim().startsWith("access"));

        const expires = cook
          ?.find((item) => item.trim().startsWith("Expires"))
          ?.split("=")[1];

        const timestamp = new Date(expires!).getTime();

        user.access = jwtCook || "";
        user.validity = timestamp;

        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.data = user;
      }

      if (token.data.validity < Date.now()) {
        return null;
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.data) {
        session.user = token.data;
      }

      return session;
    },
  },
});

//c
