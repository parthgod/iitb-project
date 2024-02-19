import bcryptjs from "bcryptjs";
import { connectToDatabase } from "@/lib/database/database";
import User from "@/lib/database/models/User";
import { handleError } from "@/utils/helperFunctions";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    newUser: "/register",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const formEmail = credentials?.email as string;
        const plainPassword = credentials?.password as string;

        await connectToDatabase();

        const user = await User.findOne({ email: formEmail });

        if (!user) {
          return null;
        }

        const isValidPassword = await bcryptjs.compare(plainPassword, user?.password);

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user?._id,
          name: user?.name || "Anonymous",
          email: user?.email,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ profile, user }) {
      try {
        await connectToDatabase();
        const userExists = await User.findOne({ email: profile?.email || user.email });
        if (!userExists) {
          await User.create({
            name: profile?.name || user.name,
            email: profile?.email || user.email,
            image: profile?.image || user.image,
          });
        }
        return true;
      } catch (error) {
        handleError(error);
        return false;
      }
    },
    async session({ session, token }) {
      try {
        await connectToDatabase();
        const existingUser = await User.findOne({ email: session.user?.email });
        session.user = { ...session.user, isAdmin: existingUser?.isAdmin || false, id: existingUser?._id.toString() };
        if (existingUser.isAdmin) token.role = "admin";
        else token.role = "user";
      } catch (error) {
        console.log("callbacks error", error);
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
