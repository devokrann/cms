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
		console.error("x-> Error creating user:", error);
		return Response.error();
	}
}

export async function DELETE(req: Request) {
	try {
		const userId = await req.json();

		const userRecord = await prisma.user.findUnique({ where: { id: userId } });

		if (!userRecord) {
			return Response.json({ user: { exists: false } });
		} else {
			await deleteUser(userId);

			return Response.json({ user: { exists: true } });
		}
	} catch (error) {
		console.error("x-> Error deleting user:", error);
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

const deleteUser = async (id: string) => {
	// delete user and user-related records
	await prisma.user.delete({
		where: { id },
		include: {
			profile: true,
			accounts: true,
			sessions: true,
			authenticator: true,
			otps: true,
			otls: true,
			posts: true,
		},
	});
};
