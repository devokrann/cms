import prisma from "@/services/prisma";

export async function POST(req: Request) {
	try {
		const tagTitle = await req.json();

		// query database for tag
		const tagRecord = await prisma.tag.findUnique({ where: { title: tagTitle } });

		if (!tagRecord) {
			// create tag
			await prisma.tag.create({ data: { title: tagTitle } });

			return Response.json({ tag: { exists: false } });
		} else {
			return Response.json({ tag: { exists: true } });
		}
	} catch (error) {
		console.error("x-> Error creating tag:", error);
		return Response.error();
	}
}

export async function DELETE(req: Request) {
	try {
		const tagTitle = await req.json();

		// query database for tag
		const tagRecord = await prisma.tag.findUnique({ where: { title: tagTitle } });

		if (!tagRecord) {
			return Response.json({ tag: { exists: false } });
		} else {
			// delete tag
			await prisma.tag.delete({ where: { title: tagTitle } });

			return Response.json({ tag: { exists: true } });
		}
	} catch (error) {
		console.error("x-> Error deleting tag:", error);
		return Response.error();
	}
}
