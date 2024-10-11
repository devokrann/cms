import { enumRequest } from "@/types/enums";
import { TagCreate, TagGet } from "@/types/model/tag";

const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/tags`;
const headers = {
	"Content-Type": "application/json",
	Accept: "application/json",
};

export const getTags = async () => {
	try {
		const response = await fetch(apiUrl, {
			method: enumRequest.GET,
			headers,
		});

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("X-> Error getting tags:", error);
	}
};

export const removeTags = async (tags: TagGet) => {
	try {
		const response = await fetch(apiUrl, {
			method: enumRequest.DELETE,
			body: JSON.stringify(tags),
			headers,
		});

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("X-> Error removing tags:", error);
	}
};

export const addTag = async (tag: TagCreate) => {
	try {
		const response = await fetch(`${apiUrl}/new-tag`, {
			method: enumRequest.POST,
			body: JSON.stringify(tag),
			headers,
		});

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("X-> Error adding tag:", error);
	}
};

export const removeTag = async (tag: TagGet) => {
	try {
		const response = await fetch(`${apiUrl}/${tag.id}`, {
			method: enumRequest.DELETE,
			body: JSON.stringify(tag),
			headers,
		});

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("X-> Error removing tag:", error);
	}
};
