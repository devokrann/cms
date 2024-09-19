import prisma from "@/services/prisma";

export async function GET(req: Request) {
	try {
		// query database for users
		const userRecords = await prisma.user.findMany();

		if (!userRecords) {
			return Response.json({ users: null });
		} else {
			return Response.json({ users: userRecords });
		}
	} catch (error) {
		console.error("x-> Error getting user:", (error as Error).message);
		return Response.error();
	}
}
