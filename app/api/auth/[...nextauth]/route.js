// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import User from "@/models/User";

export const handler = NextAuth({
	providers: [
		GitHub({
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {},
				password: {},
			},
			async authorize(credentials) {
				await connectDB();
				const user = await User.findOne({ email: credentials.email });
				if (!user || !user.password) {
					throw new Error("No user found");
				}
				const isValid = await bcrypt.compare(
					credentials.password,
					user.password
				);
				if (!isValid) throw new Error("Invalid password");
				return user;
			},
		}),
	],
	// adapter: MongoDBAdapter(clientPromise),
	// secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		async signIn({ user, account, profile }) {
			await connectDB();
			const existingUser = await User.findOne({ email: user.email });
			if (!existingUser) {
				await User.create({
					name: user.name,
					email: user.email,
					image: user.image,
					provider: account.provider,
				});
			}
			return true;
		},
		async session({ session }) {
			await connectDB();
			const user = await User.findOne({ email: session.user.email });
			session.user.id = user._id;
			return session;
		},
	},
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/login",
		signUp: "/signup",
	},
	secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
