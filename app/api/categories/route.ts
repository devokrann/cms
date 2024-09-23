import prisma from "@/services/prisma";

export async function GET(req: Request) {
	try {
		// query database for categories
		const categoryRecords = await prisma.category.findMany();

		if (!categoryRecords) {
			return Response.json(null);
		} else {
			return Response.json(categoryRecords);
		}
	} catch (error) {
		console.error("x-> Error getting categories:", error);
		return Response.error();
	}
}
