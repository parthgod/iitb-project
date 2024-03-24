import { connectToDatabase } from "@/lib/database/database";
import User from "@/lib/database/models/User";
import { IUser } from "@/utils/defaultTypes";
import bcryptjs from "bcryptjs";
import { NextAuthOptions } from "next-auth";
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
    maxAge: 5 * 60,
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

        await User.findByIdAndUpdate(user._id, { latestLoginTime: new Date() });

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
            latestLoginTime: new Date(),
          });
        } else {
          if (userExists.disabled) {
            return false;
          }
          await User.findByIdAndUpdate(userExists._id, { latestLoginTime: new Date() });
        }
        return true;
      } catch (error) {
        throw new Error(typeof error === "string" ? error : JSON.stringify(error));
      }
    },
    async session({ session, token }) {
      try {
        await connectToDatabase();
        const existingUser = await User.findOne({ email: session.user?.email });
        session.user = {
          ...session.user,
          isAdmin: existingUser?.isAdmin,
          id: existingUser?._id.toString(),
          disabled: existingUser.disabled,
        };
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
