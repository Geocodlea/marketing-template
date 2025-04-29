import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "/utils/dbMongoClient";
import EmailProvider from "next-auth/providers/email";
import FacebookProvider from "next-auth/providers/facebook";
import TikTokProvider from "@/utils/TikTokProvider";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import sendVerificationRequest from "/utils/sendEmailVerification";

import { getServerSession } from "next-auth/next";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      authorization: {
        url: "https://www.facebook.com/v22.0/dialog/oauth",
        params: {
          scope:
            "email,public_profile,ads_read,ads_management,pages_read_engagement,pages_show_list",
        },
      },
    }),

    TikTokProvider({
      clientId: process.env.TIKTOK_CLIENT_ID,
      clientSecret: process.env.TIKTOK_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allow relative callback URLs (like "/profile-details")
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      // Allow full URLs from the same origin
      if (url.startsWith(baseUrl)) return url;

      // Block anything else (external redirects)
      return baseUrl;
    },

    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },

    async signIn({ account }) {
      const session = await getServerSession(authOptions);

      if (account.provider === "facebook") {
        await dbConnect();
        await User.updateOne(
          { _id: session.user.id },
          { "facebook.accessToken": account.access_token }
        );
      }

      return true;
    },
  },

  events: {
    async createUser({ user }) {
      await dbConnect();
      await User.updateOne(
        { _id: user.id },
        {
          $set: {
            "facebook.adsRemaining": 10,
          },
        }
      );
    },
  },

  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request", // (used for check email message)
    newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
