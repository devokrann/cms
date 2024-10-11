import { Credentials } from "@/types/auth";
import { enumRequest } from "@/types/enums";
import { Verify } from "@/types/form";

const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth`;
const headers = {
	"Content-Type": "application/json",
	Accept: "application/json",
};

export const authSignIn = async (credentials: Credentials) => {
	try {
		const response = await fetch(`${apiUrl}/sign-in`, {
			method: enumRequest.POST,
			body: JSON.stringify(credentials),
			headers,
		});

		const res = await response.json();

		return { response, ...res };
	} catch (error) {
		console.error("X-> Error signing in:", error);
	}
};

export const authVerify = async (data: Verify) => {
	try {
		const response = await fetch(`${apiUrl}/verify`, {
			method: enumRequest.POST,
			body: JSON.stringify(data),
			headers,
		});

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("X-> Error verifying:", error);
	}
};

export const authVerifyResend = async (data: { email: string }) => {
	try {
		const response = await fetch(`${apiUrl}/verify/resend`, {
			method: enumRequest.POST,
			body: JSON.stringify(data),
			headers,
		});

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("X-> Error re-verifying:", error);
	}
};

export const passwordForgot = async (data: { email: string }) => {
	try {
		const response = await fetch(`${apiUrl}/password/forgot`, {
			method: enumRequest.POST,
			body: JSON.stringify(data),
			headers,
		});

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("X-> Sending 'forgot password' request:", error);
	}
};

export const passwordReset = async (data: { password: string }, params: { userId: string; token: string }) => {
	try {
		const response = await fetch(`${apiUrl}/password/reset/${params.userId}/${params.token}`, {
			method: enumRequest.POST,
			body: JSON.stringify(data),
			headers,
		});

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("X-> Error resetting password:", error);
	}
};
