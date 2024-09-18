import { addEmailContact } from "@/handlers/contact";
import { sendSignUpEmail } from "@/handlers/email";
import { getFourDigitCode } from "@/libraries/generators/code";
import prisma from "@/services/prisma";
import hasher from "@/utilities/hasher";

export async function POST(req: Request) {
	try {
		const { email, password } = await req.json();

		// query database for user
		const userRecord = await prisma.user.findUnique({ where: { email } });

		if (!userRecord) {
			if (!password) {
				// create user record
				await createUser({ email });

				return Response.json({
					user: { exists: false },
					otp: null,
					resend: null,
				});
			} else {
				// create password hash
				const passwordHash = await hasher.hash(password);

				// create user record
				passwordHash && (await createUser({ email, password: passwordHash }));

				// create otp
				const otpValue = getFourDigitCode();
				// create otp hash
				const otpHash = await hasher.hash(otpValue.toString());
				// create otp record
				otpHash && (await createOtp({ email, otp: otpHash }));

				return Response.json({
					user: { exists: false },
					otp: { value: otpValue },
					// send otp email and output result in response body
					resend: await verify(otpValue, email),
				});
			}
		} else {
			if (!userRecord.verified) {
				return Response.json({ user: { exists: true, verified: false } });
			} else {
				return Response.json({ user: { exists: true, verified: true } });
			}
		}
	} catch (error) {
		console.error("x-> Error signing up:", (error as Error).message);
		return Response.error();
	}
}

const createUser = async (fields: { email: string; password?: string }) => {
	try {
		await prisma.user.create({
			data: {
				email: fields.email,
				password: fields.password ? fields.password : null,
				verified: fields.password ? false : true,
			},
		});
	} catch (error) {
		console.error("x-> Error creating user record:", (error as Error).message);
		throw error;
	}
};

const createOtp = async (fields: { email: string; otp: string }) => {
	const expiry = new Date(Date.now() + 60 * 60 * 1000);

	try {
		await prisma.user.update({
			where: {
				email: fields.email,
			},
			data: {
				otps: {
					create: [{ email: fields.email, otp: fields.otp, expiresAt: expiry }],
				},
			},
		});
	} catch (error) {
		console.error("x-> Error creating otp record:", (error as Error).message);
		throw error;
	}
};

const verify = async (otpValue: number, email: string) => {
	// send otp email
	const emailResponse = await sendSignUpEmail({ otp: otpValue.toString(), email });
	// add to audience
	const contactResponse = await addEmailContact({ email });

	return { email: emailResponse, contact: contactResponse };
};
