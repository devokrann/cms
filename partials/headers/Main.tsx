"use client";

import React from "react";

import { Anchor, Avatar, Box, Burger, Grid, GridCol, Group } from "@mantine/core";

import LayoutSection from "@/layouts/Section";
import Brand from "@/components/Brand";
import InputSearchHeader from "@/components/inputs/search/Header";
import MenuAvatar from "@/components/menus/Avatar";
import AuthSignIn from "@/components/auth/signIn";
import SwitchTheme from "@/components/switches/Theme";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Main({
	mobileOpened,
	toggleMobile,
	desktopOpened,
	toggleDesktop,
}: {
	mobileOpened: any;
	toggleMobile: any;
	desktopOpened: any;
	toggleDesktop: any;
}) {
	const { data: session } = useSession();

	return (
		<LayoutSection>
			<Grid gutter={0} align="center">
				<GridCol span={{ base: 2, xs: 3, md: 4 }}>
					<Group>
						<Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
						<Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />

						<Anchor component={Link} href={"/"} visibleFrom="sm">
							<Brand />
						</Anchor>
					</Group>
				</GridCol>

				<GridCol span={{ base: 8, xs: 6, md: 4 }}>
					<InputSearchHeader />
				</GridCol>

				<GridCol span={{ base: 2, xs: 3, md: 4 }}>
					<Group justify="end">
						<Box visibleFrom="sm">
							<SwitchTheme />
						</Box>

						{!session ? (
							<AuthSignIn>
								<Avatar />
							</AuthSignIn>
						) : (
							<MenuAvatar />
						)}
					</Group>
				</GridCol>
			</Grid>
		</LayoutSection>
	);
}
