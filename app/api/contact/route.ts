import { addEmailContact } from "@/handlers/contact";
import { sendGeneralInquiryEmail } from "@/handlers/email";

export async function POST(req: Request) {
	try {
		const dataForm = await req.json();

		// send email
		const emailResponse = await sendGeneralInquiryEmail(dataForm);
		// add to audience
		const contactResponse = await addEmailContact(dataForm);

		return Response.json({ email: emailResponse, contact: contactResponse });
	} catch (error) {
		console.error("x-> Error sending contact message:", (error as Error).message);
		return Response.error();
	}
}
