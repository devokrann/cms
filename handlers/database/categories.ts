import { enumRequest } from "@/types/enums";

const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api`;
const headers = {
	"Content-Type": "application/json",
	Accept: "application/json",
};

export const getCategories = async () => {
	try {
		const response = await fetch(`${apiUrl}/categories`, {
			method: enumRequest.GET,
			headers,
		});

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("X-> Error getting categories:", error);
	}
};

export const addCategory = async (title: string) => {
	try {
		const response = await fetch(`${apiUrl}/category`, {
			method: enumRequest.POST,
			body: JSON.stringify(title),
			headers,
		});

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("X-> Error adding category:", error);
	}
};

export const removeCategory = async (title: string) => {
	try {
		const response = await fetch(`${apiUrl}/category`, {
			method: enumRequest.DELETE,
			body: JSON.stringify(title),
			headers,
		});

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("X-> Error removing category:", error);
	}
};
