import prisma from "@/services/prisma";
import { enumUserStatus } from "@/types/enums";
import { UserGet } from "@/types/model/user";

export async function GET(req: Request) {
	try {
		// query database for users
		const userRecords = await prisma.user.findMany();

		if (!userRecords) {
			return Response.json(null);
		} else {
			return Response.json(userRecords);
		}
	} catch (error) {
		console.error("x-> Error getting user:", error);
		return Response.error();
	}
}

export async function PUT(req: Request) {
	try {
		const { users, mode } = await req.json();

		if (mode == enumUserStatus.ACTIVE || mode == enumUserStatus.INACTIVE) {
			// update users' status
			const userStatusUpdate = await Promise.all(
				users.map(async (u: UserGet) => {
					// query database for user
					const userRecord = await prisma.user.findUnique({ where: { id: u.id } });

					if (userRecord) {
						if (mode == enumUserStatus.ACTIVE || mode == enumUserStatus.INACTIVE) {
							// update user status
							const userUpdateStatus = await updateUserStatus(u, mode);
							return userUpdateStatus;
						}
					}
				})
			);

			return Response.json({ users: userStatusUpdate });
		}

		return Response.json({ users: null });
	} catch (error) {
		console.error("x-> Error updating user:", error);
		return Response.error();
	}
}

const updateUserStatus = async (user: UserGet, mode: enumUserStatus) => {
	try {
		const result = await prisma.user.update({ where: { id: user.id }, data: { status: mode } });

		return result;
	} catch (error) {
		console.error("x-> Error updating user status:", (error as Error).message);
		throw error;
	}
};
