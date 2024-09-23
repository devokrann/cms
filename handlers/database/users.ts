import { enumRequest } from "@/types/enums";

export const getUsers = async () => {
	try {
		const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/users", {
			method: enumRequest.GET,
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("X-> Error getting users:", error);
	}
};
