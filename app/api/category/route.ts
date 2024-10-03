import prisma from "@/services/prisma";
import { CategoryCreate, CategoryGet } from "@/types/model/category";

export async function POST(req: Request) {
	try {
		const category: CategoryCreate = await req.json();

		// query database for category
		const categoryRecord = await prisma.category.findUnique({ where: { title: category.title } });

		if (!categoryRecord) {
			// create category
			const createCategory = await prisma.category.create({ data: { title: category.title } });

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
		const category: CategoryGet = await req.json();

		// query database for category
		const categoryRecord = await prisma.category.findUnique({ where: { title: category.title } });

		if (!categoryRecord) {
			return Response.json({ category: { exists: false } });
		} else {
			// delete category
			await prisma.category.delete({ where: { title: category.title } });

			return Response.json({ category: { exists: true } });
		}
	} catch (error) {
		console.error("x-> Error deleting category:", error);
		return Response.error();
	}
}
