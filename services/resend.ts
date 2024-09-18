import { Resend } from "resend";

const resend = {
	onboarding: new Resend(process.env.NEXT_RESEND_KEY),
	// general: new Resend(process.env.NEXT_RESEND_KEY_GENERAL),
};

export default resend;
