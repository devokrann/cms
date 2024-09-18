import NextAuth from "next-auth";
import authConfig from "./auth.config";

import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./services/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: PrismaAdapter(prisma),

	session: {
		maxAge: 7 * 24 * 60 * 60, // Use the 'rememberMe' field to adjust maxAge
		updateAge: 24 * 60 * 60, // Update session every day if 'rememberMe' is set
		strategy: "jwt",
	},

	...authConfig,
});
