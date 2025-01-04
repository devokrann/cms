import { enumRequest } from "@/types/enums";

const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/upload`;

export const uploadFile = async (file: File) => {
	try {
		const formData = new FormData();
		formData.append("file", file);

		const response = await fetch(apiUrl, {
			method: enumRequest.POST,
			body: formData,
		});

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("X-> Post request error:", error);
		throw error;
	}
};
