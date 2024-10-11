import prisma from "@/services/prisma";
import { ProfileCreate } from "@/types/model/profile";
import { UserGet, UserRelations } from "@/types/model/user";
import hasher from "@/utilities/hasher";
import { StatusUser } from "@prisma/client";

export async function POST(req: Request) {
	try {
		const user: UserRelations = await req.json();

		// query database for user
		const userRecord = await prisma.user.findUnique({ where: { email: user.email } });

		if (!userRecord) {
			// create password hash
			const passwordHash = await hasher.hash(user.password!);

			// create user
			await createUser({ ...user, password: passwordHash ? passwordHash : null });

			// create user profile if profile is provided
			user.profile && passwordHash && (await createProfile({ email: user.email, ...user.profile }));

			return Response.json({ user: { exists: false } });
		} else {
			return Response.json({ user: { exists: true } });
		}
	} catch (error) {
		console.error("x-> Error creating user:", error);
		return Response.error();
	}
}

export async function PUT(req: Request, { params }: { params: { userId: string } }) {
	try {
		// query database for user
		const userRecord = await prisma.user.findUnique({ where: { id: params.userId } });

		if (!userRecord) {
			return Response.json({ user: { exists: false } });
		} else {
			const { user, mode } = await req.json();

			if (mode == StatusUser.ACTIVE || mode == StatusUser.INACTIVE) {
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

export async function DELETE(req: Request, { params }: { params: { userId: string } }) {
	try {
		const userRecord = await prisma.user.findUnique({ where: { id: params.userId } });

		if (!userRecord) {
			return Response.json({ user: { exists: false } });
		} else {
			await deleteUser(params.userId);

			return Response.json({ user: { exists: true } });
		}
	} catch (error) {
		console.error("x-> Error deleting user:", error);
		return Response.error();
	}
}

const createUser = async (fields: UserRelations) => {
	try {
		await prisma.user.create({
			data: {
				role: fields.role,
				status: fields.status,
				name: fields.name,

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

const updateUserStatus = async (user: UserGet, mode: StatusUser) => {
	try {
		const result = await prisma.user.update({ where: { id: user.id }, data: { status: mode } });

		return result;
	} catch (error) {
		console.error("x-> Error updating user status:", (error as Error).message);
		throw error;
	}
};

const createProfile = async (fields: Omit<ProfileCreate, "user"> & { email: string }) => {
	try {
		await prisma.user.update({
			where: { email: fields.email },

			data: {
				profile: {
					create: {
						firstName: fields.firstName,
						lastName: fields.lastName,
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
