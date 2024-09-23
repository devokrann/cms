import prisma from "@/services/prisma";

export async function GET(req: Request) {
	try {
		// query database for tags
		const tagRecords = await prisma.tag.findMany();

		if (!tagRecords) {
			return Response.json(null);
		} else {
			return Response.json(tagRecords);
		}
	} catch (error) {
		console.error("x-> Error getting tags:", error);
		return Response.error();
	}
}
