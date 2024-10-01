import prisma from "@/services/prisma";
import { PostGet } from "@/types/model/post";

export async function GET(req: Request) {
	try {
		// query database for posts
		const postRecords = await prisma.post.findMany({ include: { category: true, tags: true, user: true } });

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

export async function DELETE(req: Request) {
	try {
		const posts: PostGet[] = await req.json();
		const postIds: string[] = posts.map(p => p.id);

		// delete database posts
		const postDelete = await prisma.post.deleteMany({ where: { id: { in: postIds } } });

		if (!postDelete) {
			return Response.json(null);
		} else {
			return Response.json(postDelete);
		}
	} catch (error) {
		console.error("x-> Error deleting posts:", error);
		return Response.error();
	}
}
