import prisma from "@/services/prisma";
import { typeDevice } from "@/types/device";
import { typeIpInfo } from "@/types/ipInfo";

export async function POST(req: Request) {
	try {
		const { userId, sessionToken, tokenExpiry, device, ...locationData } = await req.json();

		// find current session
		const currentSession = await prisma.session.findUnique({ where: { sessionToken } });

		if (!currentSession) {
			// create session
			await createSession({ userId, token: sessionToken, tokenExpiry, device, locationData });

			return Response.json({ session: { exists: false } });
		} else {
			// Get the current date and time
			const now = new Date();

			// Compare the current time with the session's expiration time
			const expired = now > currentSession.expires;
			if (!expired) {
				return Response.json({ session: { exists: true, expired: false, data: currentSession } });
			} else {
				// delete expired session
				await prisma.session.delete({ where: { sessionToken } });

				// create new session
				await createSession({
					userId,
					token: sessionToken,
					tokenExpiry,
					device,
					locationData,
				});

				return Response.json({
					session: {
						exists: true,
						expired: true,
					},
				});
			}
		}
	} catch (error) {
		console.error("x-> Error checking session:", error);
		return Response.error();
	}
}

const createSession = async (fields: {
	userId: string;
	token: string;
	tokenExpiry: Date;
	device: typeDevice | null;
	locationData: typeIpInfo | null;
}) => {
	try {
		await prisma.user.update({
			where: {
				id: fields.userId,
			},
			data: {
				sessions: {
					create: [
						{
							sessionToken: fields.token,
							// os: fields.device ? fields.device.os : null,
							// ...fields.locationData,
							expires: fields.tokenExpiry,
						},
					],
				},
			},
		});
	} catch (error) {
		console.error("x-> Error creating user session record:", (error as Error).message);
		throw error;
	}
};
