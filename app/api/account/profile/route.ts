import { auth } from "@/auth";
import prisma from "@/services/prisma";

export async function POST(req: Request) {
	try {
		const session = await auth();

		const { name, email, phone } = await req.json();

		const userRecord = await prisma.user.findUnique({ where: { id: session?.user.id } });

		if (!userRecord) {
			return Response.json({ user: { exists: false } });
		} else {
			await prisma.user.update({
				where: { id: session?.user.id },
				data: { name },
			});

			// update session on server
			if (session?.user) {
				session.user.name = name;
			}

			return Response.json({ user: { exists: true } });
		}
	} catch (error) {
		console.error("x-> Error updating profile details:", (error as Error).message);
		return Response.error();
	}
}
