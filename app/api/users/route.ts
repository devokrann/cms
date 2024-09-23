import prisma from "@/services/prisma";

export async function GET(req: Request) {
	try {
		// query database for users
		const userRecords = await prisma.user.findMany();

		if (!userRecords) {
			return Response.json(null);
		} else {
			return Response.json(userRecords);
		}
	} catch (error) {
		console.error("x-> Error getting user:", error);
		return Response.error();
	}
}
