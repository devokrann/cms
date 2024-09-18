import resend from "@/services/resend";

export const addEmailContact = async (formData: { fname?: string; lname?: string; email: string }) => {
	const { data, error } = await resend.onboarding.contacts.create({
		email: formData.email,
		firstName: formData.fname,
		lastName: formData.lname,
		unsubscribed: false,
		audienceId: process.env.NEXT_RESEND_AUDIENCE_ID_GENERAL!,
	});

	if (!error) {
		return data;
	} else {
		console.error("x-> Error adding email contact:", (error as Error).message);
		throw error;
	}
};
