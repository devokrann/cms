import prisma from "@/services/prisma";

export async function POST(req: Request) {
	try {
		const post = await req.json();

		// query database for tag
		const postRecord = await prisma.post.findUnique({
			where: { userId_title: { userId: post.author, title: post.title } },
		});

		if (!postRecord) {
			// create post
			await prisma.user.update({
				where: { id: post.author },
				data: {
					posts: {
						create: {
							title: post.title,
							content: post.content,

							tags: {
								connect: post.tags.map((t: string) => {
									return { title: t };
								}),
							},

							category: { connect: { id: post.category } },
						},
					},
				},
			});

			return Response.json({ tag: { exists: false } });
		} else {
			return Response.json({ tag: { exists: true } });
		}
	} catch (error) {
		console.error("x-> Error creating post:", error);
		return Response.error();
	}
}

export async function DELETE(req: Request) {
	try {
		const post = await req.json();

		// query database for tag
		const postRecord = await prisma.post.findUnique({ where: { id: post.id } });

		if (!postRecord) {
			return Response.json({ tag: { exists: false } });
		} else {
			// delete post
			await prisma.post.delete({ where: { id: post.id } });

			return Response.json({ tag: { exists: true } });
		}
	} catch (error) {
		console.error("x-> Error deleting post:", error);
		return Response.error();
	}
}
