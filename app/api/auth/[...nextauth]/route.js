import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "/utils/dbMongoClient";
import FacebookProvider from "next-auth/providers/facebook";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      authorization: {
        url: "https://www.facebook.com/v22.0/dialog/oauth",
        params: {
          scope:
            "email,ads_management,business_management,pages_read_engagement,pages_show_list,pages_manage_posts,pages_manage_ads,pages_read_user_content,leads_retrieval",
        },
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },

    async session({ session, user }) {
      session.user.id = user.id;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
