import prisma from "@/services/prisma";
import hasher from "@/utilities/hasher";

export async function POST(req: Request) {
	try {
		const credentials = await req.json();

		// check if user exists
		const userRecord = await prisma.user.findUnique({ where: { email: credentials.email as string } });

		if (!userRecord) {
			return Response.json({ user: { exists: false } });
		} else {
			// check if provided password is correct
			const passwordMatch = await hasher.compare(credentials.password as string, userRecord.password);

			if (!passwordMatch) {
				return Response.json({ user: { exists: true, password: { matches: false } } });
			} else {
				return Response.json({
					user: {
						exists: true,
						password: { matches: true },
						data: userRecord,
					},
				});
			}
		}
	} catch (error) {
		console.error("x-> Error signing in:", (error as Error).message);
		return Response.error();
	}
}
