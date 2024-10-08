import prisma from "@/services/prisma";
import { enumUserStatus } from "@/types/enums";
import { UserGet } from "@/types/model/user";
import hasher from "@/utilities/hasher";
import { Role, Status } from "@prisma/client";

export async function POST(req: Request) {
	try {
		const { account, profile } = await req.json();

		// query database for user
		const userRecord = await prisma.user.findUnique({ where: { email: account.email } });

		if (!userRecord) {
			// create password hash
			const passwordHash = await hasher.hash(account.password);

			// create user
			passwordHash && (await createUser({ ...account, password: passwordHash }));

			// create user profile if profile is provided
			profile.name.first && passwordHash && (await createProfile({ email: account.email, ...profile }));

			return Response.json({ user: { exists: false } });
		} else {
			return Response.json({ user: { exists: true } });
		}
	} catch (error) {
		console.error("x-> Error creating user:", error);
		return Response.error();
	}
}

export async function PUT(req: Request) {
	try {
		const { user, mode } = await req.json();

		// query database for user
		const userRecord = await prisma.user.findUnique({ where: { id: user.id } });

		if (!userRecord) {
			return Response.json({ user: { exists: false } });
		} else {
			if (mode == enumUserStatus.ACTIVE || mode == enumUserStatus.INACTIVE) {
				// update user status
				const userStatusUpdate = await updateUserStatus(user, mode);

				return Response.json({ user: { exists: true, user: userStatusUpdate } });
			}

			return Response.json({ user: { exists: true } });
		}
	} catch (error) {
		console.error("x-> Error updating user:", error);
		return Response.error();
	}
}

export async function DELETE(req: Request) {
	try {
		const { id } = await req.json();

		const userRecord = await prisma.user.findUnique({ where: { id } });

		if (!userRecord) {
			return Response.json({ user: { exists: false } });
		} else {
			await deleteUser(id);

			return Response.json({ user: { exists: true } });
		}
	} catch (error) {
		console.error("x-> Error deleting user:", error);
		return Response.error();
	}
}

const createUser = async (fields: { role: Role; status: Status; email: string; password: string }) => {
	try {
		await prisma.user.create({
			data: {
				role: fields.role,
				status: fields.status,

				email: fields.email,
				password: fields.password,

				verified: true,
			},
		});
	} catch (error) {
		console.error("x-> Error creating user:", (error as Error).message);
		throw error;
	}
};

const updateUserStatus = async (user: UserGet, mode: enumUserStatus) => {
	try {
		const result = await prisma.user.update({ where: { id: user.id }, data: { status: mode } });

		return result;
	} catch (error) {
		console.error("x-> Error updating user status:", (error as Error).message);
		throw error;
	}
};

const createProfile = async (fields: {
	email: string;
	name: { first: string; last: string };
	bio: string;
	phone: string;
	address: string;
	city: string;
	state: string;
	country: string;
}) => {
	try {
		const joinedName = `${fields.name.first} ${fields.name.last}`;

		await prisma.user.update({
			where: { email: fields.email },

			data: {
				name: joinedName.trim().length > 0 ? joinedName : null,

				profile: {
					create: {
						firstName: fields.name.first,
						lastName: fields.name.last,
						bio: fields.bio,
						phone: fields.phone,
						address: fields.address,
						city: fields.city,
						state: fields.state,
						country: fields.country,
					},
				},
			},
		});
	} catch (error) {
		console.error("x-> Error creating user profile:", (error as Error).message);
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
