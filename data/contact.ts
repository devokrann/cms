import {
	IconBrandFacebook,
	IconBrandInstagram,
	IconBrandLinkedin,
	IconBrandTwitter,
	IconBrandYoutube,
} from "@tabler/icons-react";

const companyName = "Brix";
const appName = companyName;

const contact = {
	name: { company: companyName, app: appName },
	phones: [{ type: "main", label: "(254) 123 456-789", value: "+254123456789" }],
	emails: [{ type: "main", value: "info@brix.com" }],
	socials: [
		{
			title: `${companyName} @ Twitter`,
			link: "#",
			icon: IconBrandTwitter,
		},
		{
			title: `${companyName} @ Facebook`,
			link: "#Facebook",
			icon: IconBrandFacebook,
		},
		{
			title: `${companyName} @ Instagram`,
			link: "#Instagram",
			icon: IconBrandInstagram,
		},
		{
			title: `${companyName} @ LinkedIn`,
			link: "#LinkedIn",
			icon: IconBrandLinkedin,
		},
		{
			title: `${companyName} @ YouTube`,
			link: "#YouTube",
			icon: IconBrandYoutube,
		},
	],
	hours: [
		{ label: "days", value: "Mon - Fri" },
		{ label: "times", value: "8 AM - 5 PM" },
	],
	locations: [
		{
			place: "Main Office",
			label: "410 Terry Ave. North, Seattle, WA 98109",
			link: "#",
		},
	],
};

export default contact;
