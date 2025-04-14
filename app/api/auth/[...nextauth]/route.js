import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "/utils/dbMongoClient";
import FacebookProvider from "next-auth/providers/facebook";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";

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
            "email,ads_read,ads_management,business_management,pages_read_engagement,pages_show_list,pages_manage_posts,pages_manage_ads,pages_read_user_content,leads_retrieval",
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

  events: {
    async createUser({ user }) {
      await dbConnect();
      await User.updateOne(
        { _id: user.id },
        {
          $set: {
            "facebook.adsRemaining": 1,
          },
        }
      );
    },
  },

  pages: {
    newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
