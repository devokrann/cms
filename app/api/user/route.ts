import prisma from "@/services/prisma";
import hasher from "@/utilities/hasher";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
	try {
		const user = await req.json();

		// query database for user
		const userRecord = await prisma.user.findUnique({ where: { email: user.email } });

		if (!userRecord) {
			// create password hash
			const passwordHash = await hasher.hash(user.password);

			// create user record
			passwordHash && (await createUser({ ...user, password: passwordHash }));

			return Response.json({ user: { exists: false } });
		} else {
			return Response.json({ user: { exists: true } });
		}
	} catch (error) {
		console.error("x-> Error creating user:", (error as Error).message);
		return Response.error();
	}
}

const createUser = async (fields: { email: string; role: Role; name?: string; phone?: string; password?: string }) => {
	try {
		await prisma.user.create({
			data: {
				role: `${fields.role}`,
				email: fields.email,
				name: fields.name!,
				password: fields.password ? fields.password : null,
				verified: true,
			},
		});
	} catch (error) {
		console.error("x-> Error creating user record:", (error as Error).message);
		throw error;
	}
};
