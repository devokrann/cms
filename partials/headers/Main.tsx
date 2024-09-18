import React from "react";

import { Anchor, Group, ThemeIcon } from "@mantine/core";

import { IconMail, IconPhone } from "@tabler/icons-react";

import LayoutSection from "@/layouts/Section";

import classes from "./Main.module.scss";

import contact from "@/data/contact";

export default function Main() {
	const email = contact.emails.find(e => e.type == "main");
	const phone = contact.phones.find(p => p.type == "main");

	const dataContact = [
		{
			icon: IconMail,
			link: `mailto:${email?.value}`,
			label: email?.value,
		},
		{
			icon: IconPhone,
			link: `tel:${phone?.value}`,
			label: phone?.label,
		},
	];

	return (
		<LayoutSection containerized="responsive" shadowed padded="sm" className={classes.header} visibleFrom="xs">
			<Group justify="space-between">
				<Group gap={"lg"}>
					{dataContact.map(item => (
						<Group key={item.link} gap={6} c={"pri.0"}>
							<item.icon size={20} stroke={1.5} style={{ marginTop: 2 }} />
							<Anchor
								href={item.link}
								underline="hover"
								inherit
								fz={{ base: "xs", lg: "sm" }}
								className={classes.link}
							>
								{item.label}
							</Anchor>
						</Group>
					))}
				</Group>

				<Group>
					{contact.socials.map(social => (
						<Anchor key={social.link} title={social.title} href={social.link}>
							<Group>
								<ThemeIcon size={24} color="white" className={classes.icon}>
									<social.icon size={16} stroke={2} />
								</ThemeIcon>
							</Group>
						</Anchor>
					))}
				</Group>
			</Group>
		</LayoutSection>
	);
}
