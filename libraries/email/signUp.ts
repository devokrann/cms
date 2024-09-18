import { addEmailContact } from "@/handlers/contact";
import { sendSignUpEmail } from "@/handlers/email";

export const verifyEmail = async (otpValue: number, email: string) => {
	// send otp email
	const emailResponse = await sendSignUpEmail({ otp: otpValue.toString(), email });
	// add to audience
	const contactResponse = await addEmailContact({ email });

	return { email: emailResponse, contact: contactResponse };
};
