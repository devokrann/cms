import React from "react";

import Link from "next/link";
import NextImage from "next/image";

import { Group, Box, Image, Button, Divider } from "@mantine/core";

import LayoutSection from "@/layouts/Section";
import DrawerNavMain from "@/components/drawers/nav/Main";
import NavigationMain from "@/components/navigation/Main";
import MenuAvatar from "@/components/menus/Avatar";

import AuthSignIn from "@/components/auth/signIn";

import links from "@/data/links";
import images from "@/assets/images";

import classes from "./Main.module.scss";
import contact from "@/data/contact";

import { auth } from "@/auth";

export default async function Main() {
	const session = await auth();

	return (
		<LayoutSection containerized="responsive" shadowed padded="lg" className={classes.navbar}>
			<Group justify="space-between">
				<Group align="end" gap={"lg"}>
					<Box>
						<Link href={"/"}>
							<Group>
								<Image
									src={images.brand.logo.light}
									alt={contact.name.app}
									h={{ base: 24 }}
									component={NextImage}
									width={1920}
									height={1080}
									priority
								/>
							</Group>
						</Link>
					</Box>

					<Divider orientation="vertical" visibleFrom="sm" color="pri.3" />

					<Group component={"nav"} visibleFrom="sm">
						<NavigationMain />
					</Group>
				</Group>

				<Group visibleFrom="sm">
					{!session?.user ? (
						<AuthSignIn>
							<Button size="xs" variant="light">
								Log In
							</Button>
						</AuthSignIn>
					) : (
						<MenuAvatar />
					)}
					<Button size="xs">Get in Touch</Button>
				</Group>

				<DrawerNavMain
					data={links.navbar}
					hiddenFrom="sm"
					aria-label="Toggle Navigation"
					color="light-dark(var(--mantine-color-pri-7),var(--mantine-color-pri-0))"
				/>
			</Group>
		</LayoutSection>
	);
}
