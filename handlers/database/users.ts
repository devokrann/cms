import { enumRequest } from "@/types/enums";
import { FormUserCreate } from "@/types/form";
import { UserGet } from "@/types/model/user";
import { StatusUser } from "@prisma/client";

const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/users`;
const headers = {
	"Content-Type": "application/json",
	Accept: "application/json",
};

export const getUsers = async () => {
	try {
		const response = await fetch(apiUrl, {
			method: enumRequest.GET,
			headers,
		});

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("X-> Error getting users:", error);
	}
};

export const updateUsers = async (users: UserGet[], mode: StatusUser) => {
	try {
		const response = await fetch(apiUrl, {
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

export const updateUser = async (user: UserGet, mode: StatusUser) => {
	try {
		const response = await fetch(`${apiUrl}/${user.id}`, {
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

export const addUser = async (user: FormUserCreate) => {
	try {
		const response = await fetch(`${apiUrl}/new-user`, {
			method: enumRequest.POST,
			body: JSON.stringify(user),
			headers,
		});

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("X-> Error adding user:", error);
	}
};

export const removeUser = async (user: UserGet) => {
	try {
		const response = await fetch(`${apiUrl}/${user.id}`, {
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
