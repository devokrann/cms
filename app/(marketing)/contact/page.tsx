import React from "react";

import { Metadata } from "next";

import { Anchor, Card, Flex, Grid, GridCol, Group, Stack, Text, ThemeIcon, Title } from "@mantine/core";

import { IconMail, IconPhone } from "@tabler/icons-react";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import FormContact from "@/partials/forms/Contact";
import AccordionFaq from "@/components/accordions/Faq";

import TemplateEmailContact from "@/templates/email/Contact";

import contact from "@/data/contact";

import classes from "./Contact.module.scss";

export const metadata: Metadata = { title: "Contact" };

export default async function Contact() {
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
		<LayoutPage>
			{/* <TemplateEmailContact /> */}

			{/* <LayoutSection padded containerized={"responsive"}>Contact page</LayoutSection> */}

			<LayoutSection padded containerized={"responsive"}>
				<Stack gap={64}>
					<Stack>
						<Title order={2} fz={48} fw={"bold"} ta={"center"} lh={1}>
							Let Us Know <br />
							What You Think!
						</Title>
						<Text ta={"center"}>
							Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit
							aliquam sit nullam.
						</Text>
					</Stack>

					<Grid px={{ lg: 64 }} gutter={{ base: 64, sm: "xl", lg: 64 }}>
						<GridCol span={{ base: 12, sm: 6 }} order={{ base: 2, sm: 1 }}>
							<Card withBorder shadow="xs" padding={"md"}>
								<FormContact />
							</Card>
						</GridCol>
						<GridCol span={{ base: 12, sm: 6 }} order={{ base: 1, sm: 2 }}>
							<Stack gap={"xl"}>
								<Stack gap={"xs"}>
									<Title order={3} fz={24} fw={"bold"} ta={{ base: "center", sm: "start" }} lh={1}>
										Want to reach out directly?
									</Title>
									<Text ta={{ base: "center", sm: "start" }}>
										Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus
										mollis sit aliquam sit nullam.
									</Text>
								</Stack>

								<Flex
									align={"center"}
									direction={{ base: "column", sm: "row" }}
									gap={{ base: "md", md: "xl" }}
								>
									{dataContact.map(item => (
										<Group key={item.link} w={{ base: "66%", xs: "fit-content" }}>
											<ThemeIcon size={40} variant="light">
												<item.icon size={24} stroke={1.5} style={{ marginTop: 2 }} />
											</ThemeIcon>

											<Stack gap={0}>
												<Text component="span" inherit fz={{ base: "xs", lg: "sm" }}>
													Contact:
												</Text>
												<Anchor
													href={item.link}
													underline="hover"
													inherit
													fz={{ base: "xs", lg: "sm" }}
													fw={500}
													className={classes.link}
												>
													{item.label}
												</Anchor>
											</Stack>
										</Group>
									))}
								</Flex>

								<Flex align={{ base: "center", sm: "start" }} direction={"column"} gap={"xs"}>
									<Text ta={{ base: "center", sm: "start" }}>Follow us on social media:</Text>

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
								</Flex>

								<AccordionFaq />
							</Stack>
						</GridCol>
					</Grid>
				</Stack>
			</LayoutSection>
		</LayoutPage>
	);
}
