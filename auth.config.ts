import { DefaultSession, User } from "next-auth";
import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { AdapterUser } from "next-auth/adapters";

declare module "next-auth" {
	/**
	 * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		token: string;
		rememberMe: boolean;

		user: {
			//  * By default, TypeScript merges new interface properties and overwrites existing ones.
			//  * In this case, the default session user properties will be overwritten,
			//  * with the new ones defined above. To keep the default session user properties,
			//  * you need to add them back into the newly declared interface.
			//  */
		} & DefaultSession["user"];
	}

	/**
	 * The shape of the user object returned in the OAuth providers' `profile` callback,
	 * or the second parameter of the `session` callback, when using a database.
	 */
	interface User {
		// User signin error
		error?: string;
		rememberMe?: string;
	}

	/**
	 * The shape of the account object returned in the OAuth providers' `account` callback,
	 * Usually contains information about the provider being used, like OAuth tokens (`access_token`, etc).
	 */
	interface Account {}
}

export default {
	pages: {
		signIn: "/auth/sign-in",
		signOut: "/auth/sign-out",
		error: "/auth/error", // Error code passed in query string as ?error=
		verifyRequest: "/auth/verify-request", // (used for check email message)
		// newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
	},

	providers: [
		Google,
		Credentials({
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			credentials: {
				email: {},
				password: {},
				rememberMe: {},
			},
			authorize: async credentials => {
				const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/auth/sign-in", {
					method: "POST",
					body: JSON.stringify(credentials),
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				});

				if (!response.ok) {
					return { error: response.statusText };
				} else {
					const result = await response.json();

					if (!result.user.exists) {
						return { error: "User not found" };
					} else {
						if (!result.user.password.matches) {
							return { error: "Incorrect password" };
						} else {
							return { ...result.user.data, rememberMe: credentials.rememberMe };
						}
					}
				}
			},
		}),
	],

	callbacks: {
		async signIn({ user, account, profile, email, credentials }) {
			// Check if the authorize function returned an error
			if (!user?.error) {
				// create session record if doesn't exist

				// Return true to allow the sign-in process to continue
				return true;
			} else {
				// Throw an error with the custom error message
				throw new Error(user.error);
			}
		},

		async jwt({ token, account, profile, user, session, trigger }) {
			if (account) {
				token.accessToken = account.access_token;
				token.id = user.id;
			}

			// Ensure token.user is always set if user is available
			if (user) {
				token.user = user;
			}

			if (trigger === "update" && session) {
				token.user = session.user;
			}

			if (trigger === "signIn") {
				token.rememberMe = user.rememberMe == "true" ? true : false;
			}

			if (token.rememberMe == true) {
				token.exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
			} else {
				token.exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // 1 day
			}

			// // remaining time in days
			// console.log(Math.floor(token.exp - Date.now() / 1000) / 60 / 60 / 24);

			return token;
		},

		async session({ session, token, user, newSession, trigger }) {
			session.user = token.user as AdapterUser & User;

			session.rememberMe = token.rememberMe as boolean;

			// Set session expiration dynamically based on token expiration
			session.expires = new Date(token.exp! * 1000).toISOString() as Date & string;

			// Send properties to the client, like a user id from a provider.
			session.token = token.accessToken as string;
			session.user.id = token.id as string;

			return session;
		},
	},
} satisfies NextAuthConfig;
