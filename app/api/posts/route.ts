import prisma from "@/services/prisma";

export async function GET(req: Request) {
	try {
		// query database for posts
		const postRecords = await prisma.post.findMany({ include: { category: true, tags: true } });

		if (!postRecords) {
			return Response.json(null);
		} else {
			return Response.json(postRecords);
		}
	} catch (error) {
		console.error("x-> Error getting posts:", error);
		return Response.error();
	}
}
