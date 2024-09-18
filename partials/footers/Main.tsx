import React from "react";

import NextImage from "next/image";
import Link from "next/link";

import {
	Flex,
	Grid,
	Container,
	Image,
	Text,
	Title,
	List,
	Anchor,
	Divider,
	Group,
	GridCol,
	ListItem,
	Stack,
	ThemeIcon,
} from "@mantine/core";

import LayoutSection from "@/layouts/Section";

import images from "@/assets/images";

import classes from "./Main.module.scss";
import contact from "@/data/contact";

export default function Main() {
	const linkSets = [
		{
			title: "About Us",
			links: [
				{ label: "Mission", link: "#Mission" },
				{ label: "Our Team", link: "#Team" },
				{ label: "Awards", link: "#Awards" },
				{ label: "Testimonials", link: "#Testimonials" },
				{ label: "Privacy Policy", link: "#Policy" },
			],
		},
		{
			title: "Services",
			links: [
				{ label: "Web Design", link: "#Design" },
				{ label: "Web Development", link: "#Development" },
				{ label: "Mobile Design", link: "#Mobile" },
				{ label: "UI/UX Design", link: "#UX" },
				{ label: "Branding Design", link: "#Branding" },
			],
		},
		{
			title: "Portfolio",
			links: [
				{ label: "Corporate Websites", link: "#Corporate" },
				{ label: "E-commerce", link: "#commerce" },
				{ label: "Mobile Apps", link: "#Apps" },
				{ label: "Landing Pages", link: "#Landing" },
				{ label: "UI/UX Projects", link: "#Projects" },
			],
		},
		{
			title: "Contact Us",
			links: [
				{ label: "Information", link: "#Information" },
				{ label: "Request a Quote", link: "#Quote" },
				{ label: "Consultation", link: "#Consultation" },
				{ label: "Help Center", link: "#Help" },
				{ label: "T's and C's", link: "#Terms" },
			],
		},
	];

	return (
		<LayoutSection pt={56} pb={"lg"} className={classes.footer}>
			<Container size={"responsive"}>
				<Grid gutter={{ base: "xl", md: "md" }}>
					<GridCol span={{ base: 12, md: 4, lg: 3.5 }}>
						<Flex direction={"column"} align={{ base: "center", md: "start" }} gap={"md"}>
							<Image
								src={images.brand.logo.light}
								alt="next logo"
								w={{ base: 80 }}
								component={NextImage}
								width={1920}
								height={1080}
								loading="lazy"
							/>

							<Text className="textResponsive" ta={{ base: "center", md: "start" }}>
								Lorem ipsum dolor sit amet consectetur adipiscing elit aliquam mauris sed ma
							</Text>

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
					</GridCol>
					<GridCol span={{ base: 12, md: 8, lg: 8.5 }} visibleFrom="sm">
						<Grid gutter={{ base: "xl", md: "md" }}>
							{linkSets.map(linkSet => (
								<GridCol key={linkSet.title} span={{ base: 6, xs: 4, sm: 3 }}>
									<Flex direction={"column"} align={{ base: "center", md: "end" }} gap={"xs"}>
										<Title order={4} fw={"bold"}>
											{linkSet.title}
										</Title>
										<List listStyleType="none">
											{linkSet.links.map(link => (
												<ListItem key={link.link} className={classes.listItem}>
													<Anchor
														component={Link}
														href={link.link}
														title={link.label}
														className={classes.link}
													>
														{link.label}
													</Anchor>
												</ListItem>
											))}
										</List>
									</Flex>
								</GridCol>
							))}
						</Grid>
					</GridCol>
				</Grid>
			</Container>

			<Container size={"responsive"} px={"xl"}>
				<Divider mt={56} mb={"lg"} color="var(--mantine-color-default-border)" />
			</Container>

			<Container size={"responsive"}>
				<Text fz={{ base: "xs", lg: "sm" }} ta={"center"}>
					<Text component="span" inherit>
						Copyright © {new Date().getFullYear()} {contact.name.app}
					</Text>{" "}
					|{" "}
					<Text component="span" inherit>
						All Rights Reserved
					</Text>{" "}
					|{" "}
					<Anchor inherit href="#tc" underline="always">
						Terms and Conditions
					</Anchor>{" "}
					|{" "}
					<Anchor inherit href="#pp" underline="always">
						Privacy Policy
					</Anchor>
				</Text>
			</Container>
		</LayoutSection>
	);
}
