import contact from "@/data/contact";
import resend from "@/services/resend";

import TemplateEmailCodeSignUp from "@/templates/email/code/SignUp";
import TemplateEmailCodeForgot from "@/templates/email/code/Forgot";
import TemplateEmailNofificationChanged from "@/templates/email/notification/Changed";
import TemplateEmailContact from "@/templates/email/Contact";

import { typeFormContact } from "@/types/form";

export const sendGeneralInquiryEmail = async (formData: typeFormContact) => {
	// switch to 'resend.general' when your domain is configured
	const { data, error } = await resend.onboarding.emails.send({
		/**
		 * add and verify a production domain in resend dashboard
		 * replace 'onboarding@resend.dev' below with the intended sender email
		 * 'NEXT_EMAIL_INFO' as defined in the '.env' files
		 */
		from: `${formData.fname} ${formData.lname} <${"onboarding@resend.dev"}>`,
		to: [process.env.NEXT_EMAIL_INFO as string],
		// cc:[]
		subject: formData.subject,
		react: TemplateEmailContact(formData),
		reply_to: formData.email,
	});

	if (!error) {
		return data;
	} else {
		console.error("x-> Error sending general inquiry email:", (error as Error).message);
		throw error;
	}
};

export const sendSignUpEmail = async (values: { otp: string; email: string }) => {
	// switch to 'resend.general' when your domain is configured
	const { data, error } = await resend.onboarding.emails.send({
		/**
		 * add and verify a production domain in resend dashboard
		 * replace 'onboarding@resend.dev' below with the intended sender email
		 * 'NEXT_EMAIL_NOREPLY' as defined in the '.env' files
		 */
		from: `${contact.name.company} <${"onboarding@resend.dev"}>`,
		/**
		 * add and verify a production domain in resend dashboard
		 * replace 'devokrann@gmail.com' below with 'values.email'
		 */
		to: ["devokrann@gmail.com"],
		// cc:[]
		subject: `Verify Your Email Address`,
		react: TemplateEmailCodeSignUp(values.otp),
		// reply_to: formData.email,
	});
	if (!error) {
		return data;
	} else {
		console.error("x-> Error emailing sign up code:", (error as Error).message);
		throw error;
	}
};

export const sendForgotPasswordEmail = async (values: { otl: string; email: string }) => {
	// switch to 'resend.general' when your domain is configured
	const { data, error } = await resend.onboarding.emails.send({
		/**
		 * add and verify a production domain in resend dashboard
		 * replace 'onboarding@resend.dev' below with the intended sender email
		 * 'NEXT_EMAIL_NOREPLY' as defined in the '.env' files
		 */
		from: `${contact.name.company} <${"onboarding@resend.dev"}>`,
		/**
		 * add and verify a production domain in resend dashboard
		 * replace 'devokrann@gmail.com' below with 'values.email'
		 */
		to: ["devokrann@gmail.com"],
		// cc:[]
		subject: `Reset Your Password`,
		react: TemplateEmailCodeForgot(values.otl),
		// reply_to: formData.email,
	});
	if (!error) {
		return data;
	} else {
		console.error("x-> Error emailing password reset link:", (error as Error).message);
		throw error;
	}
};

export const sendPasswordChangedEmail = async (values: { email: string }) => {
	// switch to 'resend.general' when your domain is configured
	const { data, error } = await resend.onboarding.emails.send({
		/**
		 * add and verify a production domain in resend dashboard
		 * replace 'onboarding@resend.dev' below with the intended sender email
		 * 'NEXT_EMAIL_NOREPLY' as defined in the '.env' files
		 */
		from: `${contact.name.company} <${"onboarding@resend.dev"}>`,
		/**
		 * add and verify a production domain in resend dashboard
		 * replace 'devokrann@gmail.com' below with 'values.email'
		 */
		to: ["devokrann@gmail.com"],
		// cc:[]
		subject: `Password Changed`,
		react: TemplateEmailNofificationChanged(),
		// reply_to: formData.email,
	});
	if (!error) {
		return data;
	} else {
		console.error("x-> Error emailing password change notification:", (error as Error).message);
		throw error;
	}
};
