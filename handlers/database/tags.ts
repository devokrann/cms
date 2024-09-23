import { enumRequest } from "@/types/enums";

const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/tag`;
const headers = {
	"Content-Type": "application/json",
	Accept: "application/json",
};

export const getTags = async () => {
	try {
		const response = await fetch(`${apiUrl}s`, {
			method: enumRequest.GET,
			headers,
		});

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("X-> Error getting tags:", error);
	}
};

export const addTag = async (title: string) => {
	try {
		const response = await fetch(apiUrl, {
			method: enumRequest.POST,
			body: JSON.stringify(title),
			headers,
		});

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("X-> Error adding tag:", error);
	}
};

export const removeTag = async (title: string) => {
	try {
		const response = await fetch(apiUrl, {
			method: enumRequest.DELETE,
			body: JSON.stringify(title),
			headers,
		});

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("X-> Error removing tag:", error);
	}
};
