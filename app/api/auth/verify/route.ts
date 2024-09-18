import prisma from "@/services/prisma";
import hasher from "@/utilities/hasher";

export async function POST(req: Request) {
	try {
		const { otp, email } = await req.json();

		// query database for user
		const userRecord = await prisma.user.findUnique({ where: { email } });

		if (!userRecord) {
			return Response.json({ user: { exists: false } });
		} else {
			if (!userRecord.verified) {
				// query database for otp
				const otpRecord = await prisma.otp.findUnique({ where: { email } });

				if (!otpRecord) {
					return Response.json({
						user: { exists: true, verified: false },
						otp: { exists: false },
					});
				} else {
					const matches = otpRecord && (await hasher.compare(otp, otpRecord?.otp));

					if (!matches) {
						return Response.json({
							user: { exists: true, verified: false },
							otp: { exists: true, matches: false },
						});
					} else {
						const now = new Date();
						const expired = otpRecord && otpRecord.expiresAt < now;

						if (!expired) {
							// update user field to verified
							await prisma.user.update({ where: { email }, data: { verified: true } });

							// delete used otp record
							await prisma.otp.delete({ where: { email } });

							return Response.json({
								user: { exists: true, verified: false },
								otp: { exists: true, matches: true, expired: false },
							});
						} else {
							// delete expired otp record
							await prisma.otp.delete({ where: { email } });

							return Response.json({
								user: { exists: true, verified: false },
								otp: { exists: true, matches: true, expired: true },
							});
						}
					}
				}
			} else {
				return Response.json({ user: { exists: true, verified: true } });
			}
		}
	} catch (error) {
		console.error("x-> Error signing up:", (error as Error).message);
		return Response.error();
	}
}
