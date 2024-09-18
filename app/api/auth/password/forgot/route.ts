import { sendForgotPasswordEmail } from "@/handlers/email";
import prisma from "@/services/prisma";
import hasher from "@/utilities/hasher";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
	try {
		const { email } = await req.json();

		// query database for user
		const userRecord = await prisma.user.findUnique({ where: { email } });

		if (!userRecord) {
			return Response.json({ user: { exists: false } });
		} else {
			// query database for link
			const otlRecord = await prisma.otl.findUnique({ where: { email } });
			// handle null password field for oauth sign-up's
			const samplePassword = process.env.NEXT_EXAMPLE_PASSWORD;

			if (!otlRecord) {
				// create otl value
				const otlValue = await createOtlValue({
					id: userRecord.id,
					email: userRecord.email,
					password: userRecord.password ? userRecord.password : (samplePassword as string),
				});

				// create otl record
				await createOtlRecord({ email: userRecord.email, otl: otlValue });

				return Response.json({
					user: {
						exists: true,
						otl: {
							exists: false,
							value: otlValue,
							// email new link and show result in response body
							resend: await sendMail({ email: userRecord.email, otl: otlValue }),
						},
					},
				});
			} else {
				const now = new Date();
				const expired = otlRecord.expiresAt < now;

				if (!expired) {
					const expiry = otlRecord.expiresAt.getTime() - now.getTime();

					return Response.json({
						user: {
							exists: true,
							otl: {
								exists: true,
								value: otlRecord.otl,
								expired: false,
								expiry,
								valid: expiry > 55 * 60 * 1000,
							},
						},
					});
				} else {
					// delete expired otl record
					await prisma.otl.delete({ where: { email } });

					// create new otl value
					const otlValueNew = await createOtlValue({
						id: userRecord.id,
						email: userRecord.email,
						password: userRecord.password ? userRecord.password : (samplePassword as string),
					});

					// create new otl record
					await createOtlRecord({ email: userRecord.email, otl: otlValueNew });

					return Response.json({
						user: {
							exists: true,
							otl: {
								exists: true,
								value: otlValueNew,
								expired: true,
								// email new link and show result in response body
								resend: await sendMail({ email: userRecord.email, otl: otlValueNew }),
							},
						},
					});
				}
			}
		}
	} catch (error) {
		console.error("x-> Error emailing password reset link:", (error as Error).message);
		return Response.error();
	}
}

const createOtlValue = async (fields: { id: string; email: string; password: string }) => {
	// create token
	const secret = process.env.NEXT_JWT_KEY + fields.password;
	const token = jwt.sign({ email: fields.email, id: fields.id }, secret, {
		expiresIn: "5m",
	});

	return process.env.NEXT_PUBLIC_API_URL + `/auth/password/reset/${fields.id}/${token}`;
};

const createOtlRecord = async (fields: { email: string; otl: string }) => {
	// expiry 1 hour
	const expiry = new Date(Date.now() + 60 * 60 * 1000);

	const otlHash = await hasher.hash(fields.otl);

	try {
		otlHash &&
			(await prisma.user.update({
				where: {
					email: fields.email,
				},
				data: {
					otls: {
						create: [{ email: fields.email, otl: otlHash, expiresAt: expiry }],
					},
				},
			}));
	} catch (error) {
		console.error("x-> Error creating otl record:", (error as Error).message);
		throw error;
	}
};

const sendMail = async (fields: { otl: string; email: string }) => {
	// send otl email
	const emailResponse = await sendForgotPasswordEmail({ otl: fields.otl, email: fields.email });

	return { email: emailResponse };
};
