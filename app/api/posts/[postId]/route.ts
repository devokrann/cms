import prisma from "@/services/prisma";
import { PostRelations } from "@/types/model/post";

export async function POST(req: Request) {
	try {
		const post: PostRelations = await req.json();

		// query database for post
		const postRecord = await prisma.post.findUnique({ where: { title: post.title } });

		if (!postRecord) {
			// create post
			await prisma.post.create({
				data: {
					title: post.title,
					content: post.content,
					allowComments: post.allowComments,
					anonymous: post.anonymous,
					status: post.status,

					// connect user to post
					userId: !post.userId ? undefined : post.userId,
					// connect category to post
					categoryId: post.categoryId ? post.categoryId : undefined,
					// connect tags to post
					tags: !post.tags ? undefined : { connect: post.tags },
				},
			});

			return Response.json({ post: { exists: false } });
		} else {
			return Response.json({ post: { exists: true } });
		}
	} catch (error) {
		console.error("x-> Error creating post:", error);
		return Response.error();
	}
}

export async function DELETE(req: Request, { params }: { params: { postId: string } }) {
	try {
		// query database for post
		const postRecord = await prisma.post.findUnique({ where: { id: params.postId } });

		if (!postRecord) {
			return Response.json({ post: { exists: false } });
		} else {
			// delete post
			const postDelete = await prisma.post.delete({ where: { id: params.postId } });

			return Response.json({ post: { exists: true, post: postDelete } });
		}
	} catch (error) {
		console.error("x-> Error deleting post:", error);
		return Response.error();
	}
}
