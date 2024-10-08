import { enumRequest, enumUserStatus } from "@/types/enums";
import { UserGet } from "@/types/model/user";

const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api`;
const headers = {
	"Content-Type": "application/json",
	Accept: "application/json",
};

export const getUsers = async () => {
	try {
		const response = await fetch(`${apiUrl}/users`, {
			method: enumRequest.GET,
			headers,
		});

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("X-> Error getting users:", error);
	}
};

export const updateUsers = async (users: UserGet[], mode: enumUserStatus) => {
	try {
		const response = await fetch(`${apiUrl}/users`, {
			method: enumRequest.PUT,
			body: JSON.stringify({ users, mode }),
			headers,
		});

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("X-> Error updating users:", error);
	}
};

export const updateUser = async (user: UserGet, mode: enumUserStatus) => {
	try {
		const response = await fetch(`${apiUrl}/user`, {
			method: enumRequest.PUT,
			body: JSON.stringify({ user, mode }),
			headers,
		});

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("X-> Error updating user:", error);
	}
};

export const removeUser = async (user: UserGet) => {
	try {
		const response = await fetch(`${apiUrl}/user`, {
			method: enumRequest.DELETE,
			body: JSON.stringify(user),
			headers,
		});

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("X-> Error removing user:", error);
	}
};
