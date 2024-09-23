import prisma from "@/services/prisma";

export async function POST(req: Request) {
	try {
		const categoryTitle = await req.json();

		// query database for category
		const categoryRecord = await prisma.category.findUnique({ where: { title: categoryTitle } });

		if (!categoryRecord) {
			// create category
			const createCategory = await prisma.category.create({ data: { title: categoryTitle } });

			return Response.json({ category: { exists: false, category: createCategory } });
		} else {
			return Response.json({ category: { exists: true } });
		}
	} catch (error) {
		console.error("x-> Error creating category:", error);
		return Response.error();
	}
}

export async function DELETE(req: Request) {
	try {
		const categoryTitle = await req.json();

		// query database for category
		const categoryRecord = await prisma.category.findUnique({ where: { title: categoryTitle } });

		if (!categoryRecord) {
			return Response.json({ category: { exists: false } });
		} else {
			// delete category
			await prisma.category.delete({ where: { title: categoryTitle } });

			return Response.json({ category: { exists: true } });
		}
	} catch (error) {
		console.error("x-> Error deleting category:", error);
		return Response.error();
	}
}
