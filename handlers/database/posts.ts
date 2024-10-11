import { enumRequest } from "@/types/enums";
import { FormPostCreate } from "@/types/form";
import { PostGet } from "@/types/model/post";

const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/posts`;
const headers = {
	"Content-Type": "application/json",
	Accept: "application/json",
};

export const getPosts = async () => {
	try {
		const response = await fetch(apiUrl, {
			method: enumRequest.GET,
			headers,
		});

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("X-> Error getting posts:", error);
	}
};

export const removePosts = async (posts: PostGet[]) => {
	try {
		const response = await fetch(apiUrl, {
			method: enumRequest.DELETE,
			body: JSON.stringify(posts),
			headers,
		});

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("X-> Error removing posts:", error);
	}
};

export const addPost = async (post: FormPostCreate) => {
	try {
		const response = await fetch(`${apiUrl}/new-post`, {
			method: enumRequest.POST,
			body: JSON.stringify(post),
			headers,
		});

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("X-> Error adding post:", error);
	}
};

export const removePost = async (post: PostGet) => {
	try {
		const response = await fetch(`${apiUrl}/${post.id}`, {
			method: enumRequest.DELETE,
			body: JSON.stringify(post),
			headers,
		});

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("X-> Error removing post:", error);
	}
};
